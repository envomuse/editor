'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('MainCtrl',['$scope', '$log', 'authServie', 'playerServie', 'dbservice',
  	function ($scope, $log, authServie, playerServie, dbservice) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      authServie.someMethod()
    ];

    $.when(dbservice.insert())
    .then(function(newDoc) {
      $log.debug('newDoc:', newDoc);
      $scope.doc = newDoc;

      return dbservice.selectAll()
    })
    .then(function(docs) {
      console.log('all count:', docs);
      return dbservice.count();
    })
    .then(function(count) {
      console.log('count:', count);
    });

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
