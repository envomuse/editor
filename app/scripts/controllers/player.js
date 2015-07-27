'use strict';

/**
 * @ngdoc function
 * @name musicPlayerApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the musicPlayerApp
 */
angular.module('musicPlayerApp')
  .controller('PlayerCtrl', ['$scope', '$routeParams', '$sce', '$log', '$timeout', 'playerServie', 'dbservice',
    'trackModelService',
  	function ($scope, $routeParams, $sce, $log, $timeout, playerServie, dbservice, trackModelService) {
  		var controller = this;

      $scope.clearAll = function () {
        dbservice.clearAll();
      }

      controller.videos = [];

      playerServie.getTodayTrackList()
      .then(function (trackList) {
        console.log(trackList);
        $scope.trackList = trackList;

        angular.forEach(trackList, function(track) {
           var fileUrl = 'file://'+track.trackFilePath;
           var oneSource = { sources: [{src: $sce.trustAsResourceUrl(fileUrl), type: 'audio/mpeg'}] };
            controller.videos.push(oneSource); 
        });

        controller.setVideo(0);
      });

  		// get video sources -> controller.videos = 
  		
  		
  		
 
  		// videogular config
        controller.API = null;
        controller.currentVideo = 0;
  		
  		controller.onPlayerReady = function(API) {
  			console.log(API);
            controller.API = API;
        };

        controller.onCompleteVideo = function() {
            controller.isCompleted = true;

            controller.currentVideo++;

            // if (controller.currentVideo >= controller.videos.length) controller.currentVideo = 0;

            // controller.setVideo(controller.currentVideo);
        };

        controller.config = {
            preload: "none",
            autoHide: false,
            autoHideTime: 3000,
            autoPlay: true,
            // sources: controller.videos[0].sources,
            theme: {
            	url: "../bower_components/videogular-themes-default/videogular.css"
            },
   //          plugins: {
			// 	poster: "http://www.videogular.com/assets/images/videogular.png"
			// }
        };

        controller.setVideo = function(index) {
          $log.info('setVideo:', index);
            controller.API.stop();
            controller.currentVideo = index;
            controller.config.sources = controller.videos[index].sources;
            $timeout(controller.API.play.bind(controller.API), 100);
        };

  }]);
