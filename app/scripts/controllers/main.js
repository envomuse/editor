'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('MainCtrl',['$rootScope', '$scope', 'logService', 'authServie', 'playerServie', 'editorService', 'dbservice', 
  	function ($rootScope, $scope, logService, authServie, playerServie, editorService, dbservice) {

    $scope.init = function () {
      $scope.rootDirectory = editorService.getRootDirectory();
      $scope.boxList = editorService.getBoxList();
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
    }

    $scope.$on('fileSelect', function (evt, file) {
      editorService.setRootDirectory(file.path);
    });

    $rootScope.$on('rootDirectoryChangeEvent', function (evt, file) {
      $scope.$apply(function () {
        $scope.rootDirectory = editorService.getRootDirectory();
        $scope.boxList = editorService.getBoxList();
      });
    });


    // init all
    $scope.init();
    
  }]);
