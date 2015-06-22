'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.editorService
 * @description
 * # editorService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('editorService', ['$rootScope', '$q', 'lodash', 'playerServie', function ($rootScope, $q, lodash, playerServie) {
    // Service logic
    // ...
    var walk = require('walk'),
        path = require('path'), 
        fs = require('fs');

    var supportAudioFormat = ['.mp3', '.wav'];
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
              // var deferred = $q.defer();
              filePath = path.resolve(boxPath, fileStat.name);
              deferred = playerServie.getMetaInfo(filePath)
              .then(function (metaInfo) {
                  song = {
                    name: fileStat.name,
                    extname: extname,
                    mime: extname === '.wav' ? 'audio/wav' : 'audio/mpeg',
                    path: path.resolve(boxPath, fileStat.name),
                    size: fileStat.size,

                    metadata: metaInfo.metadata,
                    format: metaInfo.format,
                    duration: metaInfo.duration,

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
        this.refresh();
      },

      refresh : function () {
        _clearBox();
        var promises = [];
        var files = fs.readdirSync(rootDirectory);
        angular.forEach(files, function(file) {
          var boxPath = path.resolve(rootDirectory, file);
          if (fs.lstatSync(boxPath).isDirectory()) {
            promises.push(_appendBox(boxPath));
          }
        });

        $q.all(promises)
        .then(function () {
          console.log('all done');
          $rootScope.$emit('rootDirectoryChangeEvent', '');
        });
        
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
      } 
    };
}]);
