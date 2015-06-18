'use strict';

/**
 * @ngdoc overview
 * @name envomusPlayerApp
 * @description
 * # envomusPlayerApp
 *
 * Main module of the application.
 */
angular
  .module('musicPlayerApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.grid'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(['$rootScope', '$interval', '$log', 'configService',
   function($rootScope, $interval, $log, configService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      
    });
    
    //Start Timer
    configService.getConfig().
    then(function(config) {
      $log.log(config);
    });

  }]);


