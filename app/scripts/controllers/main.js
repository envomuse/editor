'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('MainCtrl',['$rootScope', '$scope', '$location', '$q', 'utilService', 'logService', 'authServie', 'playerServie', 'clockService', 'dbservice', 
  	function ($rootScope, $scope, $location, $q, utilService, logService, authServie, playerServie, clockService, dbservice) {

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

    $scope.openBoxDetail = function(box) {
      console.log('open box:', box);
      $location.path('/box/'+box.name);
    };

    $scope.onRootDirectorySelected = function (file) {
      console.log('onRootDirectorySelected');
      utilService.showLoading();
      clockService.setRootDirectory(file.path)
      .finally(function () {
        utilService.hideLoading();
      });
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

    $scope.setTimeLine = function(boxList){

      if(boxList.length>0)
      {
        // console.log(boxList);
        var clock = boxList.filter(function(e){
          return (typeof e.startTm!=='undefined') && (typeof e.endTm!=='undefined');
        }).map(function(e){
        
            return {
              title:e.name,
              start:e.startTm,
              end:e.endTm,
              /*start:defaultDateStr.concat(e.startTm.substring(10)),
              end:defaultDateStr.concat(e.endTm.substring(10)),*/
              color: '#'+(Math.random()*0xFFFFFF<<0).toString(16)
            };
      });

        if(clock.length>0){
            $('#hourly').timestack({
            span: 'hour',
            data:  clock
          });  
        }
      }
    }

    // init all
    $scope.init();

    //set timeline
    $scope.setTimeLine(clockService.getBoxList());
    
  }]);
