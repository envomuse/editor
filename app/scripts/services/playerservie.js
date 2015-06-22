'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.playerServie
 * @description
 * # playerServie
 * Factory in the musicPlayerApp.
 */

angular.module('musicPlayerApp')
  .factory('playerServie', ['$q', 'lodash', 'utilService', function($q, lodash, utilService) {
    // Service logic
    // ...
    console.log('playerServie');

    var cwd = process.cwd(),
      sampleMP3 = cwd + '/audio/Adaro-Es Ist Ein Schnee Gefallen.mp3',
      sampleFLAC = cwd + '/audio/Adele-Rolling in the deep.flac';
     
    //registor window events 
    var win = require('nw.gui').Window.get();
    win.on('close', function(){
      releaseResource();
      this.close(true);
    });

    //media player manage
    var mediaPlayerCache = {},
      assetCache = {};

    function acquireMediaAV (filepath) {
      // body...
      if (filepath in mediaPlayerCache) {
        return mediaPlayerCache[filepath];
      };
      var fs = require('fs');
      var buffer = utilService.toArrayBuffer(fs.readFileSync(filepath));
      var mediaPlayer = AV.Player.fromBuffer(buffer);
      mediaPlayerCache[filepath] = mediaPlayer;
      return mediaPlayer;
    }

    function acquireMediaAsset (filepath) {
      // body...
      if (filepath in assetCache) {
        return assetCache[filepath];
      };
      var fs = require('fs');
      var buffer = utilService.toArrayBuffer(fs.readFileSync(filepath));
      var asset = AV.Asset.fromBuffer(buffer);
      assetCache[filepath] = asset;
      return asset;
    }

    function releaseResource() {
      lodash.values(mediaPlayerCache, function(mediaPlayer) {
        mediaPlayer.stop()
      });
      mediaPlayerCache = {};
      
      lodash.values(assetCache, function(asset) {
        asset.stop()
      });
      assetCache = {};
    }

    // Public API here
    return {
      playMp3: function(musicFile) {
        var player = acquireMediaAV(sampleMP3);
        player.togglePlayback();
      },
      playFlac: function(argument) {
        var player = acquireMediaAV(sampleFLAC);
        player.togglePlayback();
      },

      getMetaInfo: function (musicFile, callback) {
        var deferred = $q.defer();
        var metaInfo = {
          metadata: null,
          duration: null,
          format: null,
          parseComplete: function() {
            return this.metadata && this.duration && this.format;
          }
        };

        function notifyMetaInfo() {
          if (metaInfo.parseComplete()) {
            if (angular.isFunction(callback)) {
              callback(metaInfo);
            } else {
              deferred.resolve(metaInfo);
            }
          }
        }

        var asset = acquireMediaAsset(sampleMP3);

        asset.once('error', function(err) {
          console.log('err is:', err);
        });

        asset.once('metadata', function(metadata) {
          metaInfo.metadata = metadata;
          notifyMetaInfo();
          console.log('metadata is:', metadata);
        });

        asset.once('duration', function(duration) {
          console.log('duration is:', duration);
          metaInfo.duration = duration;
          notifyMetaInfo();
        });

        asset.once('format', function(format) {
          metaInfo.format = format;
          notifyMetaInfo();
        });

        asset.start();

        return deferred.promise;
      }

       
    };
  }]);