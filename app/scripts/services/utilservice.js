'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.utilService
 * @description
 * # utilService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('utilService', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      toArrayBuffer: function(buffer) {
        var ab = new ArrayBuffer(buffer.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
          view[i] = buffer[i];
        }
        return ab;
      },

      toBuffer: function(ab) {
        var buffer = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
          buffer[i] = view[i];
        }
        return buffer;
      }
    };
  });
