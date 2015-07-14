'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.configService
 * @description
 * # configService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('programModelService', ['dbservice', 'backendService', '$q', '$log',
    function (dbservice, backendService, $q, $log) {
    // Service logic
    // ...
    var programStore = dbservice.getDataStore('program');

    // Public API here
    return {
      getById: function (programId, callback) {
        var deferred = $q.defer(),
        self = this;
        programStore.findOne({_id: programId}, function(err, doc) {
          if (angular.isFunction(callback)) {
            callback(err, doc);
          }
          if (err) {
            $log.error('failed to find program');
            deferred.reject();
            return;
          }
          return deferred.resolve(doc);
        });

        return deferred.promise;
      },

      insert: function (program, callback) {
        // body...
        var deferred = $q.defer();
        programStore.insert(program, function (err, newDoc) {   // Callback is optional
          if (angular.isFunction(callback)) {
            callback(err, newDoc);
          }
          if (err) {
            dtd.reject(err);
            return;
          };
          
          dtd.resolve(newDoc);
        });

        return deferred.promise;
      },

      getPlaylist: function (whichDay) {

      }
    };
  }]);
