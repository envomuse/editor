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
    'ngLodash',
    'angularMoment',
    'ui.bootstrap',
    'dialogs.main',
    "com.2fdevs.videogular",
    "com.2fdevs.videogular.plugins.controls",
    "com.2fdevs.videogular.plugins.overlayplay",
    "com.2fdevs.videogular.plugins.poster"
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/box/:boxId', {
        templateUrl: 'views/box.html',
        controller: 'BoxCtrl as controller'
      })
      .when('/period', {
        templateUrl: 'views/period.html',
        controller: 'PeriodCtrl'
      })
      .otherwise({
        redirectTo: '/main'
      });
  })
  .run(['$rootScope', '$interval', '$log', 'configService', 'syncService', 'backendService',
   function($rootScope, $interval, $log, configService, syncService, backendService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
      
    });
    
    //Start Timer
    // configService.getConfig().
    // then(function(config) {
    //   $log.log(config);
    // });

    syncService.checkServerProgram()
    .then(function() {
      syncService.sync();
    });

  }]);


