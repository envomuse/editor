'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.archiveService
 * @description
 * # archiveService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('archiveService', ['clockService', 'lodash', '$q', '$log', 
    function (clockService, _, $q, $log) {
    // Service logic
    // ...
    var path = require('path'),
      fs = require('fs-extra'),
      crypto = require('crypto'),
      gui = require('nw.gui'),
      async = require('async'),
      randomstring = require("randomstring"),
      jsonfile = require('jsonfile'),
      archiver = require('archiver');

    $log.info('gui.App.dataPath is: ',gui.App.dataPath);

    function getTempDir() {
      var tempAppDataPath = path.join(gui.App.dataPath, 'temp');
      if (!fs.existsSync(tempAppDataPath)) {
        fs.mkdirSync(tempAppDataPath);
      }

      for (var i = 10 - 1; i >= 0; i--) {
        var randomDir = path.join(tempAppDataPath, randomstring.generate());
        if (!fs.existsSync(randomDir)) {
          fs.mkdirSync(randomDir);
          return randomDir;
        };
      }
    }

    // Public API here
    return {
      saveAs: function (filepath) {
        $log.info('saveAs filepath', filepath);

        if (!clockService.valid()) {
          $log.warn('Clock无效1');
          alert('Clock无效1');
          return;
        };

        var clock = clockService.archive();
        jsonfile.writeFileSync(filepath, clock, {flag: 'w'});
      },

      recoverFrom: function (filepath) {
        $log.info('recoverFrom filepath', filepath);
        var clock = jsonfile.readFileSync(filepath);
        clockService.recover(clock);
      },

      exportPackage: function (filepath, option) {
        $log.info('exportPackage filepath:', filepath);

        var deferred = $q.defer();
        if (!clockService.valid()) {
          deferred.reject('Clock无效2');
          $log.warn('Clock无效2');
          return deferred.promise;
        };

        // generate json first
        var ASSETNAME = 'asset';
        var tmpRootDir = getTempDir(),
            assetDir = path.join(tmpRootDir, ASSETNAME),
            musicEditorPath = path.join(tmpRootDir, 'musicEditor.json');
             
        $log.info('tmpRootDir:', tmpRootDir);

        // create Asset Dir
        $log.info("Create Asset Directory");
        fs.mkdirSync(assetDir);

        var srcBoxes = clockService.getBoxList();
        var md5, hash, targetRelativePath, trackInfo;
        var allTargetRelativePath = [],
            trackInfoCache = {},
            path2trackInfo = {};
        var tmpZipFilePath;

        var fnGatherInfo = function (callback) {
          $log.info("fnGatherInfo");
          var hashDeferArr = [];
          // hashDeferArr.push($q.defer().promise);

          _.each(srcBoxes, function (box) {
            _.each(box.songList, function (track) {
              var hashDefer = $q.defer();
              hashDeferArr.push(hashDefer.promise);

              // calc hash(md5) of track
              var md5 = crypto.createHash('md5');
              fs.readFile(track.path, function (err, data) {
                if (err) {
                  return hashDefer.reject({filepath: track.path, error: err});
                }

                md5.update(data);
                var hash = md5.digest('hex');
                trackInfo = trackInfoCache[hash];

                $log.info('hash is:', hash);

                if (trackInfo) {
                  trackInfo.fromBoxs.push(box.name);
                } else {
                  targetRelativePath = path.join(box.name, track.name);
                  if (allTargetRelativePath.indexOf(targetRelativePath) >= 0) {
                    randomstring.generate(5);
                    targetRelativePath = path.join(box.name, randomstring.generate(5), '_', track.name);
                  }

                  // targetRelativePath
                  trackInfo = {
                    name: track.name,
                    srcPath: track.path,
                    targetRelativePath: targetRelativePath,
                    targetPath: path.join(assetDir, targetRelativePath),
                    duration: track.duration,
                    hash: hash,
                    fromBoxs: [box.name]
                  };
                  trackInfoCache[hash] = trackInfo;
                  path2trackInfo[track.path] = trackInfo;
                  allTargetRelativePath.push(targetRelativePath); 
                }

                hashDefer.resolve();
              })

            });
          });

          $q.all(hashDeferArr)
          .then(function () {
            $log.info('arguments is:', arguments);

            callback(null);
          }, function (err) {
            callback(err);
          });
        };
        

        // check trackInfoCache
        var fnCheckTrackInfo = function (callback) {
          $log.info("Check music assert"); _.pluck(_.values(trackInfoCache), 'srcPath');
          var srcPathArr = _.pluck(_.values(trackInfoCache), 'srcPath');

          async.filter(srcPathArr, fs.exists
            , function(results){
              // results now equals an array of the existing files
              if (results.length === srcPathArr.length) {
                return callback(null);
              } else {
                var invalidTracks = _.difference(srcPathArr, results)
                return callback('存在无效歌曲'+invalidTracks.toString());
              }
          });
        };
        
        var fnCopyTrack = function (fnCallback) {
          $log.info("fnCopyTrack Copy music to Asset Directory:", assetDir);

          var taskArray = _.map(_.values(trackInfoCache), function (trackInfo) {
            return function (callback) {
              fs.copy(trackInfo.srcPath, trackInfo.targetPath, function (err) {
                $log.debug(trackInfo.srcPath, trackInfo.targetPath);
                if (err) {
                  return callback(err);
                }
                return callback(null);
              });
            };
          });

          async.parallel(taskArray, fnCallback);
        };

        var fnGenerateMusicEditor = function (callback) {
          $log.info("fnGenerateMusicEditor");
          
          // Collect Boxes Info
          var boxes = [];
          var tracks = [];
          _.each(srcBoxes, function (box) {
            tracks = [];
            _.each(box.songList, function (track) {
              tracks.push(path2trackInfo[track.path].hash);
            });

            boxes.push({
              uuid: randomstring.generate(10),
              name: box.name,
              totalLength: box.totalLength,
              startTm: box.startTm,
              endTm: box.endTm,
              tracks: tracks
            });
          });

          // Generate One dateTemplate
          var dateTemplate = {
            name: '随便写的',
            clock: {
              boxes: boxes
            },
            periodInfo: clockService.getPeriodInfo()
          };
          
          // dump to musicEditor
          var tracksMeta = _.mapValues(trackInfoCache, function(trackInfo) {
            return _.omit(trackInfo, ['srcPath', 'targetPath']);
          });

          $log.info("Generate musicEditor.json");
          var musicEditor = {
            "uuid": randomstring.generate(10),
            "creator": option.creator,
            "created": new Date(),
            "brand": option.brand,
            "name": option.name,
            "type": 'simplified',
            'dateTemplates': [dateTemplate],
            'tracksMeta' : tracksMeta
          };

          fs.writeJson(musicEditorPath, musicEditor, callback);
        };

        var fnGenerateFinalzip = function (callback) {
        
          $log.info("Generate final zip");
          tmpZipFilePath = path.join(tmpRootDir, 'target.zip'); 
          var tmpZipFile = fs.createWriteStream(tmpZipFilePath);
          tmpZipFile.on('finish', function (finish) {
            console.log('finish:', finish);
          });
          tmpZipFile.on('close', function () {
            $log.info(archive.pointer() + ' total bytes');
            $log.info('archiver has been finalized and the output file descriptor has closed.');
            callback(null, tmpZipFilePath);
          });

          var archive = archiver.create('zip', {});
          archive.directory(assetDir, ASSETNAME);
          archive.file(musicEditorPath, {name: 'musicEditor.json'});
          archive.on('error', function(err){
            $log.error(err);
            callback(err);
          });
          archive.pipe(tmpZipFile);
          archive.finalize();
        };

        var fnMoveFinalzip = function (callback) {
          $log.info("Rename", typeof filepath, filepath);
          fs.move(tmpZipFilePath, filepath, callback);
        };

        var fnClearTmpFiles = function (callback) {
          $log.info("fnClearTmpFiles:", tmpRootDir);
          fs.remove(tmpRootDir, callback);
        };

        async.series([fnGatherInfo, 
          fnCheckTrackInfo, 
          fnCopyTrack, 
          fnGenerateMusicEditor,
          fnGenerateFinalzip,
          fnMoveFinalzip,
          fnClearTmpFiles
        ],
        // optional callback
        function(err){
            if (err) {
              $log.error("exportPackage");
              return deferred.reject(err);
            }

            $log.info("Done");
            deferred.resolve();
        });

        return deferred.promise;
      }
    };
  }]);
