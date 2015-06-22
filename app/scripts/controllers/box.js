'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:BoxCtrl
 * @description
 * # BoxCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('BoxCtrl', ['$scope', '$routeParams', '$sce', '$timeout', 'editorService', 
  	function ($scope, $routeParams, $sce, $timeout, editorService) {
  		var controller = this;

  		// get video sources -> controller.videos = 
  		$scope.box = editorService.getBox($routeParams.boxId);

      console.log('$scope.box:', $scope.box);
      
  		controller.videos = [];
  		angular.forEach($scope.box.songList, function(song) {
  			var fileUrl = 'file://'+song.path;
  			console.log(fileUrl);
  			var oneSource = { sources: [{src: $sce.trustAsResourceUrl(fileUrl), type: song.mime}] };
            controller.videos.push(oneSource); 
        });

  		// videogular config
  		controller.state = null;
        controller.API = null;
        controller.currentVideo = 0;
  		
  		controller.onPlayerReady = function(API) {
  			console.log(API);
            controller.API = API;
        };

        controller.onCompleteVideo = function() {
            controller.isCompleted = true;

            controller.currentVideo++;

            if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;

            // controller.setVideo(controller.currentVideo);
        };

        controller.config = {
            preload: "none",
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: true,
            sources: controller.videos[0].sources,
            theme: {
            	url: "../bower_components/videogular-themes-default/videogular.css"
            },
            tracks: [],
            plugins: {
				poster: "http://www.videogular.com/assets/images/videogular.png"
			}
        };

        controller.setVideo = function(index) {
            controller.API.stop();
            controller.currentVideo = index;
            controller.config.sources = controller.videos[index].sources;
            $timeout(controller.API.play.bind(controller.API), 100);
        };

  }]);
