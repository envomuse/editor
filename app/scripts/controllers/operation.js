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
	$scope.currentEnvFile = '';

	$scope.setCurrentEnvFile = function (currentEnvFile) {
		if (!$scope.$$phase) {
			//$digest or $apply
			$scope.$apply(function () {
			  $scope.currentEnvFile = currentEnvFile;
			});
		} else {
			$scope.currentEnvFile = currentEnvFile;
		}
	}

	$scope.saveEnvoFile = function  ( ) {
      // body...
      if ($scope.currentEnvFile.length < 5) {
      	alert('当前envo file不存在, 请先另存为');
      	return;
      }
      archiveService.saveAs($scope.currentEnvFile);
      $scope.setCurrentEnvFile ($scope.currentEnvFile);
    };

    $scope.saveAsNewEnvoFile = function  (file) {
      // body...
      console.log('saveConfigFile file', file.path);
      archiveService.saveAs(file.path);
      $scope.setCurrentEnvFile (file.path);
      
    };

    $scope.openEnvoFile = function  (file) {
      // body...
      console.log('openEnvoFile file', file.path);
      archiveService.recoverFrom(file.path);

      $scope.setCurrentEnvFile (file.path);
    };
  }]);
