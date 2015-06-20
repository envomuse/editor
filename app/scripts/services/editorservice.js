'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.editorService
 * @description
 * # editorService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('editorService', ['$rootScope', function ($rootScope) {
    // Service logic
    // ...
    var walk = require('walk'),
        path = require('path'), 
        fs = require('fs');

    var supportAudioFormat = ['.mp3', '.wav'];
    var rootDirectory = '',
    boxes = [];


    function _clearBox( ) {
      boxes = [];
    }

    function _appendBox(boxPath) {
      console.log('_appendBox', boxPath);
      var song, box = {
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
              song = {
                name: fileStat.name,
                extname: extname,
                mime: 'audio/mpeg',
                path: path.resolve(boxPath, fileStat.name),
                size: fileStat.size,
                duration: 1231,
                artist: "micheal",
                album: "day and night"
              };
              box.songList.push(song);
            };

            next();
          }
        }
      }
      walk.walkSync(boxPath, options);
      boxes.push(box);
    }

    // Public API here
    return {
      setRootDirectory: function (_rootDirectory) {
        rootDirectory = _rootDirectory;
        this.refresh();
      },

      refresh : function () {
        _clearBox();
        var files = fs.readdirSync(rootDirectory);
        angular.forEach(files, function(file) {
          var boxPath = path.resolve(rootDirectory, file);
          if (fs.lstatSync(boxPath).isDirectory()) {
            _appendBox(boxPath);
          }
        });

        $rootScope.$emit('rootDirectoryChangeEvent', '');
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
      } 
    };
}]);
