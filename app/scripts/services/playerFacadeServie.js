'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.playerServie
 * @description
 * # playerServie
 * Factory in the musicPlayerApp.
 */

angular.module('musicPlayerApp')
  .factory('playerFacadeServie', ['$q', '$log', 'lodash', 'programModelService', 'trackModelService'
    , function($q, $log, _, programModelService, trackModelService) {
    //registor window events 
    // var win = require('nw.gui').Window.get();
    // win.on('close', function(){
    //   releaseResource();
    //   this.close(true);
    // });

    //
    var todayTrackListCache = null;

    // Public API here
    return {
      getMsTimeInCurDay: function(date) {
        var mmt = moment(date);
        // console.log('mmt is:', mmt);
        return mmt.milliseconds()
        + mmt.seconds() *1000
        + mmt.minutes() *60*1000
        + mmt.hours() *60 *60 *1000;
      },

      getTodayTrackList: function () {
        // just return the first track found in localdb
        var retPlaylist = null;
        var deferred = $q.defer();
        var todayStart = moment().startOf('day'),
         todayEnd = moment().endOf('day');

        if (todayTrackListCache) {
          deferred.resolve(todayTrackListCache);
          return deferred.promise;
        }

        async.waterfall([
          function (callback) {
            programModelService.queryPrograms(todayStart, todayEnd, callback);
          },
          function (programs, callback) {
            if (programs.length === 0) {
              return callback('no suitable program');
            }
            var dayPlaylist;
            var existValidPlaylist = _.any(programs, function (program) {
              dayPlaylist = _.find(program.dayPlaylistArr, function (dayPlaylist) {
                var searchDate = moment(dayPlaylist.date);
                return (searchDate.year() === todayStart.year()
                  && searchDate.month() === todayStart.month()
                  && searchDate.day() === todayStart.day());
              });

              return (dayPlaylist !== null);
            });

            if (existValidPlaylist) {
              retPlaylist = dayPlaylist.playlist;
              callback(null);
            } else {
              callback('no valid playlist');
            }
          },
          function (callback) {
            var trackIdArr = _.map(retPlaylist, 'track');
            trackModelService.getByIdArray(trackIdArr, callback);
          },
          function (tracks, callback) {
            var trackIdMap = {};
            _.each(tracks, function (track) {
              trackIdMap[track._id] = track;
            });
            _.each(retPlaylist, function (trackObj) {
              trackObj.trackFilePath = trackIdMap[trackObj.track].trackFilePath;
            });
            callback(null);
          }],
          function (err) {
            if (err) {
              alert(err);
              return deferred.reject(err);
            }
            deferred.resolve(retPlaylist);
          });

        return deferred.promise;
      },

      getCalcTrack: function () {
        var deferred = $q.defer(), self = this;
        this.getTodayTrackList()
        .then(function (todayTrackList) {
          // just return the first one
          var now = self.getMsTimeInCurDay(moment()),
          retTrack = _.find(todayTrackList, function (track) {
            return now >= Number(track.exactPlayTime) && now < Number(track.exactPlayTime) + track.duration;
          })
          deferred.resolve(retTrack);
        }, function (err) {
          $log.error('getCalcTrack:', err);
          deferred.reject(err);
        })
        return deferred.promise;
      },

      getNextTrack: function () {
        var deferred = $q.defer(), self = this;
        this.getTodayTrackList()
        .then(function (todayTrackList) {
          // just return the first one
          var now = self.getMsTimeInCurDay(moment()),
          retTrack = _.find(todayTrackList, function (track) {
            return track.exactPlayTime > now;
          })
          deferred.resolve(retTrack);
        }, function (err) {
          $log.error('getNextTrack:', err);
          deferred.reject(err);
        })
        return deferred.promise;
      }
    };
  }]);