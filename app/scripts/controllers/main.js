'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('MainCtrl',['$scope', 'authServie', 'playerServie', 
  	function ($scope, authServie, playerServie) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      authServie.someMethod()
    ];

    $scope.cwd = authServie.someMethod();
    $scope.playSong = function  (argument) {
    	// body...
    	playerServie.playMp3();
    };

    $scope.playFlac = function  (argument) {
    	// body...
    	playerServie.playFlac();
    };

    
  }]);
