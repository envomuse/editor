'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.backendService
 * @description
 * # backendService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('backendService', ['$http', function ($http) {
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

      getPlaylist: function(version) {
        return $http.get(BackendUrl+'playlist?version='+version);
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
