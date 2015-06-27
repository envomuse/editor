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
      template: '<span class="btn btn-default btn-file"> {{title}} <input webkitdirectory type="file"> </span>',
      scope: {
        onFileSelected: '='
      },
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        scope.title = attrs.title;
         
        if (!('webkitdirectory' in attrs) ) {
          element.find('input').removeAttr('webkitdirectory');
        }; 

        element.bind('change', function (evt) {
        	if (evt.target.files.length) {
            scope.onFileSelected(evt.target.files[0]);
        	}
        });

        element.on('$destroy', function() {
          element.unbind('change');
        });
      }
    };
  });