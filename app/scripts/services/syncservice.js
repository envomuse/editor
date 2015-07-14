'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.syncService
 * @description
 * # syncService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('syncService', ['$log', '$q', 'lodash', 'backendService', 'programModelService','trackModelService'
    , function ($log, $q, _, backendService, programModelService, trackModelService) {
    // Service logic
    // ...

    var missingPrograms = [];
    var isSyncingProgram = false;

    // Public API here
    return {
      checkServerProgram: function () {
        $log.info('checkServerProgram');

        var deferred = $q.defer();

        backendService.getPrograms()
        .then(function(programs) {
          async.each(programs
            ,function (program, callback) {
              programModelService.getById(program._id)
              .then(function (programRec) {
                if (!programRec) {
                  if (missingPrograms.indexOf(program._id) < 0) {
                    missingPrograms.push(program);
                  };
                };
                callback(null);
              });
            }, function (err) {
              if (err) {
                $log.error(err);
                return deferred.reject(err);
              };
              $log.info('after checkServer missingPrograms:', missingPrograms);
              deferred.resolve();
            });
        });

        return deferred.promise;
      },

      syncProgram: function () {
        $log.info('syncProgram', missingPrograms);

        if (isSyncingProgram) {
          return ;
        }

        var deferred = $q.defer();
        async.whilst(
            function () { return missingPrograms.length > 0; },
            function (callback) {
                var tobeSyncProgram = missingPrograms.pop(0);
                backendService.getProgramDetail(tobeSyncProgram._id)
                .then(function (program) {
                  // store it to db
                  programService.insert(program, callback);
                });
            },
            function (err) {
              if (err) {
                $log.error(err);
                return deferred.reject(err);
              }

              return deferred.resolve();
            }
        );

        return deferred.promise;
      },

      sync: function () {
        $log.info('sync');
        this.syncProgram();
      }
    };
  }]);
