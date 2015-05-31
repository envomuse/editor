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

    var cwd = process.cwd();

    var sampleMP3 = cwd + '/audio/Adaro-Es Ist Ein Schnee Gefallen.mp3',
      sampleFLAC = cwd + '/audio/Adele-Rolling in the deep.flac';


    var fs = require('fs');

    var mp3Buffer = utilService.toArrayBuffer(fs.readFileSync(sampleMP3));
    var sampleMP3Player = AV.Player.fromBuffer(mp3Buffer);
    var flacBuffer = utilService.toArrayBuffer(fs.readFileSync(sampleFLAC));
    var sampleFLACPlayer = AV.Player.fromBuffer(flacBuffer);

    // Public API here
    return {
      playMp3: function(musicFile) {
        sampleMP3Player.togglePlayback();
      },
      playFlac: function(argument) {

        sampleFLACPlayer.togglePlayback();
      }
    };
  }]);