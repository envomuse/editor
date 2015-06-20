'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('MainCtrl',['$rootScope', '$scope', '$location', 'logService', 'authServie', 'playerServie', 'editorService', 'dbservice', 
  	function ($rootScope, $scope, $location, logService, authServie, playerServie, editorService, dbservice) {

    $scope.init = function () {
      console.log('MainCtrl init');
      var rootDir = editorService.getRootDirectory();
      if (rootDir.length < 10) {
        rootDir = '/Users/i071628/meanStack/github/envomuse/uploadAttachment/dj/new';
        editorService.setRootDirectory(rootDir);
      };

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
      $location.path('/box/'+box.name);
    }

    $scope.$on('fileSelect', function (evt, file) {
      editorService.setRootDirectory(file.path);
    });

    $rootScope.$on('rootDirectoryChangeEvent', function (evt, file) {
      if (!$scope.$$phase) {
        //$digest or $apply
        $scope.$apply(function () {
          $scope.rootDirectory = editorService.getRootDirectory();
          $scope.boxList = editorService.getBoxList();
        });
      } else {
        $scope.rootDirectory = editorService.getRootDirectory();
        $scope.boxList = editorService.getBoxList();
      }
      
    });


    // init all
    $scope.init();
    
  }]);
