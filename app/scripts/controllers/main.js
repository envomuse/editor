'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('MainCtrl',['$rootScope', '$scope', '$location', 'logService', 'authServie', 'playerServie', 'clockService', 'dbservice', 
  	function ($rootScope, $scope, $location, logService, authServie, playerServie, clockService, dbservice) {

    $scope.init = function () {
      console.log('MainCtrl init');
      var rootDir = clockService.getRootDirectory();
      if (false && rootDir.length < 10) {
        rootDir = '/Users/i071628/meanStack/github/musicPackage/';
        clockService.setRootDirectory(rootDir);
      };

      $scope.rootDirectory = clockService.getRootDirectory();
      $scope.boxList = clockService.getBoxList();
      $scope.periodInfo = clockService.getPeriodInfo();
    }

    $scope.playSong = function  (argument) {
    	// body...
    	playerServie.playMp3();
    };

    $scope.playFlac = function  (argument) {
    	// body...
    	playerServie.playFlac();
    };

    $scope.openBoxDetail = function(box) {
      console.log('open box:', box);
      $location.path('/box/'+box.name);
    };

    $scope.onRootDirectorySelected = function (file) {
      console.log('onRootDirectorySelected');
      clockService.setRootDirectory(file.path);
    };

    $scope.refreshRootDirectory = function () {
      console.log('refreshRootDirectory');
      if ($scope.rootDirectory) {
        clockService.refresh();
      }
    };

    $rootScope.$on('rootDirectoryChangeEvent', function (evt, file) {
      if (!$scope.$$phase) {
        //$digest or $apply
        $scope.$apply(function () {
          $scope.rootDirectory = clockService.getRootDirectory();
          $scope.boxList = clockService.getBoxList();
        });
      } else {
        $scope.rootDirectory = clockService.getRootDirectory();
        $scope.boxList = clockService.getBoxList();
      }
      
    });


    // init all
    $scope.init();
    
  }]);
