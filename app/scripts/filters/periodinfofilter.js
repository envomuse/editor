'use strict';

/**
 * @ngdoc filter
 * @name musicPlayerApp.filter:periodInfoFilter
 * @function
 * @description
 * # periodInfoFilter
 * Filter in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .filter('periodInfoFilter', function () {
    return function (calcType) {
    	if (calcType === 'daysOfWeek') {
    		return '星期N'
    	}
    	if (calcType === 'dateRange') {
    		return '时期段'
    	}
    	if (calcType === 'multipleDates') {
    		return '多日期'
    	}
    	return '';
    };
  });
