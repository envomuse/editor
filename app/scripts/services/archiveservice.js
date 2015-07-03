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
      randomstring = require("randomstring"),
      jsonfile = require('jsonfile'),
      archiver = require('archiver');

    console.log('gui.App.dataPath is: ',gui.App.dataPath);

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
        $log.log('saveAs filepath', filepath);

        if (!clockService.valid()) {
          alert('Clock无效');
          return;
        };

        var clock = clockService.archive();
        jsonfile.writeFileSync(filepath, clock, {flag: 'w'});
      },

      recoverFrom: function (filepath) {
        $log.log('recoverFrom filepath', filepath);
        var clock = jsonfile.readFileSync(filepath);
        clockService.recover(clock);
      },

      exportPackage: function (filepath, option) {
        console.log('filepath:', filepath);

        var deferred = $q.defer();

        $log.log('exportPackage');
        if (!clockService.valid()) {
          alert('Clock无效');
          return;
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

        // Copy All music to Asset Dir
        $log.info("Scan music meta info and do check");
        var srcBoxes = clockService.getBoxList();
        var md5, hash, targetRelativePath, trackInfo;
        var allTargetRelativePath = [],
            trackInfoCache = {},
            path2trackInfo = {};
        
        _.each(srcBoxes, function (box) {

          _.each(box.songList, function (track) {
            // calc hash(md5) of track
            md5 = crypto.createHash('md5');
            md5.update(fs.readFileSync(track.path));
            hash = md5.digest('hex');
            trackInfo = trackInfoCache[hash];

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

          });
        });

        // check trackInfoCache
        $log.info("Check music assert"); _.pluck(_.values(trackInfoCache), 'srcPath');
        var invalidTracks = _.filter(_.pluck(_.values(trackInfoCache), 'srcPath'), 
          function (trackSrcPath) {
            return !fs.existsSync(trackSrcPath);
          });
        if (invalidTracks.length) {
          alert('无效歌曲:', invalidTracks);
          return;
        };
        

        $log.info("Copy music to Asset Directory:", assetDir);
        _.forEach(_.values(trackInfoCache), function (trackInfo) {
          fs.copySync(trackInfo.srcPath, trackInfo.targetPath);
          // $log.debug(trackInfo.srcPath, trackInfo.targetPath);
        });


        $log.info("Collect Boxes Info");
        // Collect Boxes Info
        var boxes = [];
        var tracks = [];
        _.each(srcBoxes, function (box) {
          tracks = [];
          _.each(box.songList, function (track) {
            tracks.push(path2trackInfo[track.path].hash);
          });

          boxes.push({
            name: box.name,
            totalLength: box.totalLength,
            startTm: box.startTm,
            endTm: box.endTm,
            tracks: tracks
          });
        });

        // Generate One dateTemplate
        var dateTemplate = {
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
          "type": 'simplified',
          'dateTemplates': [dateTemplate],
          'tracksMeta' : tracksMeta
        };

        fs.writeJsonSync(musicEditorPath, musicEditor);

        $log.info("Generate final zip");
        
        // Zip tmpRootDir
        var zipFileDtd = $q.defer();
        var tmpZipFilePath = path.join(tmpRootDir, 'target.zip'); 
        var tmpZipFile = fs.createWriteStream(tmpZipFilePath);
        tmpZipFile.on('finish', function (finish) {
          console.log('finish:', finish);
        });
        tmpZipFile.on('close', function () {
          $log.info(archive.pointer() + ' total bytes');
          $log.info('archiver has been finalized and the output file descriptor has closed.');
          zipFileDtd.resolve();
        });

        var archive = archiver.create('zip', {});
        archive.directory(assetDir, ASSETNAME);
        archive.file(musicEditorPath, {name: 'musicEditor.json'});
        archive.on('error', function(err){
          $log.error(err);
          zipFileDtd.reject(err);
        });
        archive.pipe(tmpZipFile);
        archive.finalize();
        
        zipFileDtd.promise.then(function () {
          //
          $log.info("Rename", typeof filepath, filepath);
          fs.move(tmpZipFilePath, filepath, function (err) {
            if (err) {
              $log.error(err);
              deferred.reject(err);
              return;
            }

            $log.info("Done");
            deferred.resolve();

            // Clear tmpRootDir
            fs.remove(tmpRootDir);
          });
        });

        return deferred.promise;
      }
    };
  }]);
