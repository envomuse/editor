'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.archiveService
 * @description
 * # archiveService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('archiveService', ['clockService', 'lodash', '$log', function (clockService, _, $log) {
    // Service logic
    // ...
    var path = require('path'),
      fs = require('fs-extra'),
      crypto = require('crypto'),
      gui = require('nw.gui'),
      randomstring = require("randomstring"),
      jsonfile = require('jsonfile');

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

      exportPackage: function (filepath) {
        $log.log('exportPackage');
        if (!clockService.valid()) {
          alert('Clock无效');
          return;
        };

        // generate json first
        var tmpRootDir = getTempDir(),
            assetDir = path.join(tmpRootDir, 'asset'),
            boxDir = '';
        console.log('tmpRootDir:', tmpRootDir);

        // create Asset Dir
        $log.info("Create Asset Directory");
        fs.mkdirSync(assetDir);

        // Copy All music to Asset Dir
        $log.info("Scan music meta info and do check");
        var clock = clockService.archive();
        var md5, hash, targetRelativePath, trackInfo;
        var allTargetRelativePath = [],
            trackInfoCache = {};
        
        _.each(clock.boxes, function (box) {
          // boxDir = path.join(assetDir, box.name), 

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
          // fs.copySync(trackInfo.srcPath, trackInfo.targetPath);
          $log.debug(trackInfo.srcPath, trackInfo.targetPath);
        });

        // generate musicEditor.json 

        

        // rootDirectory: rootDirectory,
        //   periodInfo: periodInfo,
        //   boxes:  boxes

        // // generate musicEditor.json
        // var clock = clockService.archive();
        // var musicEditor = {
        //   "creator": "Auto",
        //   "brand": "cocacola",
        //   "type": 'simple',
        //   'clocks': [clock]
        // };
        // // Collect Boxes Info
        // var boxes = [];
        // var tracks = [];
        // angular.each(clock.boxes, function (box) {
        //   boxes.push({
        //     name: box.name,
        //     totalLength: box.totalLength,
        //     startTm: box.startTm,
        //     endTm: box.endTm
        //   });

        //   angular.each(box.songList, function (song) {
        //     song.
        //   })

          
          
        // })
        

      }
    };
  }]);
