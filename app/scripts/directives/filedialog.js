'use strict';

/**
 * @ngdoc directive
 * @name musicPlayerApp.directive:fileDialog
 * @description
 * # fileDialog
 */
angular.module('musicPlayerApp')
  .directive('fileDialog', function () {
    return {
      // template: '<input type="file" file-dialog/> </input>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.bind('change', function (evt) {
        	if (evt.target.files.length) {
        		scope.$emit('fileSelect', evt.target.files[0]);
        	}
        });
      }
    };
  });