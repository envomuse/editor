'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.clockService
 * @description
 * # clockService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('clockService', ['$rootScope', '$q', 'lodash', 'playerServie', function ($rootScope, $q, lodash, playerServie) {
    // Service logic
    // ...
    var walk = require('walk'),
        path = require('path'), 
        fs = require('fs');
    var supportAudioFormat = ['.mp3', '.wav'];

    // private variable
    var rootDirectory = '',
        periodInfo = {
          calcType: "daysOfWeek",
          daysOfWeekValues: {
            'Mon': true, 
            'Tue': true,
            'Wed': true, 
            'Thur': true, 
            'Fri': true, 
            'Sat': false, 
            'Sun': false
          },
          dateRangeValues: {
            'startDate': new Date(),
            'endDate': new Date()
          },
          multipleDatesValues: [new Date(),],
        },
        boxes = [];

    // private function
    function _clearBox( ) {
      boxes = [];
    }

    function _appendBox(boxPath) {
      console.log('_appendBox', boxPath);
      var promises = [], deferred, filePath,
      song, box = {
        name: path.basename(boxPath),
        path: boxPath,
        songList: [],
        totalLength: 120,
        startTm: undefined,
        endTm: undefined
      };
      var options = {
        followLinks: false,
        listeners: {
          file: function (root, fileStat, next) {
            var extname = path.extname(fileStat.name);
            if (supportAudioFormat.indexOf(extname) >= 0) {
              filePath = path.resolve(boxPath, fileStat.name);
              deferred = playerServie.getMetaInfo(filePath)
              .then(function (metaInfo) {
                  song = {
                    name: fileStat.name,
                    extname: extname,
                    mime: extname === '.wav' ? 'audio/wav' : 'audio/mpeg',
                    path: path.resolve(boxPath, fileStat.name),
                    size: fileStat.size,
                    duration: metaInfo.duration
                  };
                  box.songList.push(song);
                  console.log('resolve');
                });
              promises.push(deferred);
            };

            next();
          }
        }
      }
      walk.walkSync(boxPath, options);
      boxes.push(box);

      return $q.all(promises)
      .then(function() {
        var totalLength = 0;
        angular.forEach(box.songList, function(song) {
          totalLength += song.duration;
        });
        box.totalLength = totalLength;
        console.log('totalLength is:', totalLength);
      });
    }

    // Public API here
    return {
      setRootDirectory: function (_rootDirectory) {
        rootDirectory = _rootDirectory;
        return this.refresh();
      },

      refresh : function () {
        var deferred = $q.defer();

        _clearBox();
        var promises = [];
        var files = fs.readdirSync(rootDirectory);
        angular.forEach(files, function(file) {
          var boxPath = path.resolve(rootDirectory, file);
          if (fs.lstatSync(boxPath).isDirectory()) {
            promises.push(_appendBox(boxPath));
          }
        });

        if (promises.length === 0) {
          console.log('all done with no promises');
          $rootScope.$emit('rootDirectoryChangeEvent', '');
          deferred.resolve();
          // return; 
        } else {
          $q.all(promises)
          .then(function () {
            console.log('all done');
            $rootScope.$emit('rootDirectoryChangeEvent', '');
            deferred.resolve();
          });
        }

        return deferred.promise;
        
      },

      getRootDirectory: function() {
        return rootDirectory;
      },


      getBoxList: function() {
        console.log('getBoxList:', boxes);
        return boxes;
      },

      getBox: function (boxName) {
        var retBox = undefined;
        angular.forEach(boxes, function(box) {
          if (box.name === boxName) {
            retBox = box;
          }
        });

        return retBox;
      },

      getPeriodInfo: function () {
        return periodInfo;
      },

      // Archive Feature
      valid: function () {
        return rootDirectory.length > 3;
      },

      archive: function () {
        var clock = {
          rootDirectory: rootDirectory,
          periodInfo: periodInfo,
          boxes:  boxes
        };
        return clock;
      },

      recover: function (clock) {
        rootDirectory = clock.rootDirectory,
        periodInfo = clock.periodInfo,
        boxes = clock.boxes;
        $rootScope.$emit('rootDirectoryChangeEvent', 'recover');
      }
    };
}]);
