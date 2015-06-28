'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.archiveService
 * @description
 * # archiveService
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('archiveService', ['editorService', '$log', function (editorService, $log) {
    // Service logic
    // ...
 
    var jsonfile = require('jsonfile');

    // Public API here
    return {
      saveAs: function (filepath) {
        $log.log('saveAs filepath', filepath);
        var clock = editorService.archive();
        if (!clock.rootDirectory) {
          alert('请设置工作目录');
          return;
        };
 
        jsonfile.writeFileSync(filepath, clock, {flag: 'w'});
      },

      recoverFrom: function (filepath) {
        $log.log('recoverFrom filepath', filepath);
        var clock = jsonfile.readFileSync(filepath);
        editorService.recover(clock);
      }
    };
  }]);
