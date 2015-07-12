'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.syncService
 * @description
 * # syncService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('syncService', ['$log', 'lodash', 'backendService', 'programService'
    , function ($log, _, backendService, programService) {
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
          var missingPrograms = [];
          async.each(programs
            ,function (program, callback) {
              programService.getById(program._id)
              .then(function (program) {
                if (program) {
                  if (missingPrograms.indexOf(program._id) < 0) {
                    missingPrograms.push(program._id);
                  };
                };

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
        $log.info('syncProgram');

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
                  missingPrograms.
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
      }

      sync: function () {
        $log.info('sync');
        syncProgram();
      }
    };
  }]);
