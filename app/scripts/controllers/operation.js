'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:OperationCtrl
 * @description
 * # OperationCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('OperationCtrl', ['$rootScope', '$scope', 'archiveService',
   function ($rootScope, $scope, archiveService) {
    $scope.saveAsNewEnvoFile = function  (file) {
      // body...
      console.log('saveConfigFile file', file.path);
      archiveService.saveAs(file.path);
    };

    $scope.openEnvoFile = function  (file) {
      // body...
      console.log('openEnvoFile file', file.path);
      archiveService.recoverFrom(file.path);
    };
  }]);
