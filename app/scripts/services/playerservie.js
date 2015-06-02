'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.playerServie
 * @description
 * # playerServie
 * Factory in the musicPlayerApp.
 */

angular.module('musicPlayerApp')
  .factory('playerServie', ['utilService', function(utilService) {
    // Service logic
    // ...
    console.log('playerServie');

    var cwd = process.cwd(),
      sampleMP3 = cwd + '/audio/Adaro-Es Ist Ein Schnee Gefallen.mp3',
      sampleFLAC = cwd + '/audio/Adele-Rolling in the deep.flac';
     
    //registor window events 
    var win = require('nw.gui').Window.get();
    win.on('close', function(){
      console.log('my close');
      releaseMediaArray();
      this.close(true);
    });

    //media player manage
    var mediaPlayerMap = {};
    var mediaPlayerArray = [];

    function acquireMedia (filepath) {
      // body...
      if (filepath in mediaPlayerMap) {
        return mediaPlayerMap[filepath];
      };
      var fs = require('fs');
      var buffer = utilService.toArrayBuffer(fs.readFileSync(filepath));
      var mediaPlayer = AV.Player.fromBuffer(buffer);
      mediaPlayerArray.push(mediaPlayer);
      mediaPlayerMap[filepath] = mediaPlayer;
      return mediaPlayer;
    }

    function releaseMediaArray() {
      for (var mediaPlayer in mediaPlayerArray) {
        mediaPlayer.stop()
      };
      mediaPlayerArray = [];
      mediaPlayerMap = {};
    }

    // Public API here
    return {
      playMp3: function(musicFile) {
        var player = acquireMedia(sampleMP3);
        player.togglePlayback();
      },
      playFlac: function(argument) {
        var player = acquireMedia(sampleFLAC);
        player.togglePlayback();
      }
    };
  }]);