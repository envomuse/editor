'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:OperationCtrl
 * @description
 * # OperationCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('OperationCtrl', ['$rootScope', '$scope', 'archiveService', 'dialogs',
   function ($rootScope, $scope, archiveService, dialogs) {
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

    $scope.openExportDialog = function () {
      dialogs.create('views/exportSetting.html','ExportPackageCtrl',
        {},
        {size:'md'});
      return;
    };
    
  }])
.controller('ExportPackageCtrl', ['$rootScope', '$scope', 'archiveService', '$log',
   function ($rootScope, $scope, archiveService, $log) {
    $scope.name = '';
    $scope.brand = '';
    $scope.creator = '';

    $scope.exportPackage = function (file) {
      $log.log('exportPackage file');
      var option = {
        name: $scope.name,
        brand: $scope.brand,
        creator: $scope.creator
      };
      archiveService.exportPackage(file.path, option); 
    }
   }]);
