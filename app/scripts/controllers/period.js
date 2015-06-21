'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:PeriodCtrl
 * @description
 * # PeriodCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('PeriodCtrl', ['$scope', 'editorService', 'lodash' , function ($scope, editorService, lodash) {
    var periodInfo = editorService.getPeriodInfo();
    $scope.init = function() {
      $scope.periodInfo = periodInfo;
      $scope.dt = new Date();
    };
    $scope.init();

    $scope.changeCalcType = function() {
      console.log('changeCalcType');
    };

    $scope.addMultipleDatesValues = function(inDate) {
      var date = lodash.find(periodInfo.multipleDatesValues, function(date) {
        console.log(date);
        return date.getYear() === inDate.getYear()
        && date.getMonth() === inDate.getMonth()
        && date.getDate() === inDate.getDate();
      });
      console.log('find date:', date);
      if (date) {
        return;
      };
      periodInfo.multipleDatesValues.push(inDate);
      console.log('addMultipleDatesValues');
    };

    $scope.removeMultipleDatesValues = function(idx) {
      periodInfo.multipleDatesValues.splice(idx, 1);
      console.log('removeMultipleDatesValues');
    };

    $scope.setDaysOfWeekMode = function(type) {
      console.log('setDaysOfWeekMode:', type);
      if (type === 'weekday') {
        periodInfo.daysOfWeekValues = {
          'Mon': true, 
          'Tue': true,
          'Wed': true, 
          'Thur': true, 
          'Fri': true, 
          'Sat': false, 
          'Sun': false
        };
      }
      if (type === 'weekend') {
        periodInfo.daysOfWeekValues = {
          'Mon': false, 
          'Tue': false,
          'Wed': false, 
          'Thur': false, 
          'Fri': false, 
          'Sat': true, 
          'Sun': true
        };
      }
      if (type === 'everyday') {
        periodInfo.daysOfWeekValues = {
          'Mon': true, 
          'Tue': true,
          'Wed': true, 
          'Thur': true, 
          'Fri': true, 
          'Sat': true, 
          'Sun': true
        };
      }
    };
     
  }]);
