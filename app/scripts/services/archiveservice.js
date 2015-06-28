'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.archiveService
 * @description
 * # archiveService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('archiveService', ['clockService', '$log', function (clockService, $log) {
    // Service logic
    // ...
 
    var jsonfile = require('jsonfile');

    // Public API here
    return {
      saveAs: function (filepath) {
        $log.log('saveAs filepath', filepath);

        if (!clockService.valid()) {
          alert('Clock无效');
          return;
        };

        var clock = clockService.archive();
        jsonfile.writeFileSync(filepath, clock, {flag: 'w'});
      },

      recoverFrom: function (filepath) {
        $log.log('recoverFrom filepath', filepath);
        var clock = jsonfile.readFileSync(filepath);
        clockService.recover(clock);
      },

      exportPackage: function (filepath) {
        $log.log('exportPackage');
        if (!clockService.valid()) {
          alert('Clock无效');
          return;
        };

        // generate json first
        
      }
    };
  }]);
