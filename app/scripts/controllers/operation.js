'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:OperationCtrl
 * @description
 * # OperationCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('OperationCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
    $scope.saveConfigFile = function  (file) {
      // body...
      console.log('saveConfigFile file', file.path);
    };

    $scope.openConfigFile = function  (file) {
      // body...
      console.log('openConfigFile file', file.path);
    };
  }]);
