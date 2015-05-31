'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
