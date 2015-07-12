'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.backendService
 * @description
 * # backendService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('backendService', ['$http', $log, function ($http, $log) {
    // Service logic
    // ...

    var BackendUrl = 'http://localhost:5000/terminal/';

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      },

      login: function() {
        return $http.post(BackendUrl+'login', {
          mac: 'abc',
          uuid: 'wbc'
        });
      },

      getConfig: function() {
        return $http.get(BackendUrl+'config');
      },

      getJingoList: function() {
        return $http.get(BackendUrl+'jingoList');
      },

      getPrograms: function() {
        $log.info('get program general info');

        return $http.get(BackendUrl+'playlists')
        .then(function (resp) {
          var playlists = resp.data;
          return playlists;
        });
        // return $http.get(BackendUrl+'playlists');
      },

      getProgramDetail: function(playlistId) {
        $log.info('sync program:', playlistId);
        
        return $http.get(BackendUrl+'playlists/'+playlistId);
      },

      getMusic: function(songId) {
        return $http.get(BackendUrl+':songId/hqfile'.replace(':songId', songId));
      },

      postHeartBeat: function() {
        return $http.post(BackendUrl+'login', {
          mac: 'abc',
          uuid: 'wbc'
        });
      }
     };
  }]);
