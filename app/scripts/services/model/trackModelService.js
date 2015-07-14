'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.configService
 * @description
 * # configService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('trackModelService', ['dbservice', 'backendService', '$q', '$log',
    function (dbservice, backendService, $q, $log) {
    // Service logic
    // ...
    var trackStore = dbservice.getDataStore('track');

    // Public API here
    return {
      getTrackById: function () {
        var deferred = $q.defer(),
        self = this;
        trackStore.findOne({}, function(err, doc) {
          if (err) {
            $log.error('failed to find track');
            deferred.reject();
            return;
          }
          if (doc) {
            deferred.resolve(doc);
            return;
          };
        });
        return deferred.promise;
      }
    };
  }]);
