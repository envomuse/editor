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
        var deferred = $q.defer();
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

      queryPrograms: function (startDate, endDate, callback) {
        var deferred = $q.defer();
        programStore.find({
          $or: [ {startDate: {
            $gte: startDate,
            $lte: endDate,
          }}, {endDate: {
            $gte: startDate,
            $lte: endDate,
          }} ]
          
        })
        .sort('-created')
        .exec(function(err, programs) {
          if (angular.isFunction(callback)) {
            callback(err, programs);
          }
          if (err) {
            $log.error('find programs error');
            deferred.reject(err);
            return;
          };

          // Sort Program if needed
          deferred.resolve(programs);
        });

        return deferred.promise;
      },

      getStore: function () {
        return programStore;
      },
    };
  }]);
