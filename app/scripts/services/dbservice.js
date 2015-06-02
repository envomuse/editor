'use strict';

/**
 * @ngdoc service
 * @name musicPlayerApp.dbservice
 * @description
 * # dbservice
 * Factory in the musicPlayerApp.
 */
angular.module('musicPlayerApp')
  .factory('dbservice', function () {
    // Service logic
    // ...
    console.log(require('nw.gui').App.dataPath);

    var meaningOfLife = 42;
    var Datastore = require('nedb')
    , path = require('path')
    , db = new Datastore({ filename: path.join(require('nw.gui').App.dataPath, 'music.db'),
    autoload: true });

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      },

      insert: function  (argument) {
        var dtd = $.Deferred();
        // body...
        var doc = {
          name: 'hello',
          path: 'helloSong'
        };

        db.insert(doc, function (err, newDoc) {   // Callback is optional
          if (err) {
            dtd.reject(err);
            return;
          };
          // newDoc is the newly inserted document, including its _id
          // newDoc has no key called notToBeSaved since its value was undefined
          dtd.resolve(newDoc);
        });

        return dtd.promise();
      },

      count: function  (argument) {
        // body...
        var dtd = $.Deferred();
        db.count({}, function (err, count) {
          if (err) {
            dtd.reject(err);
            return;
          };
          dtd.resolve(count);
        });

        return dtd.promise();
      },

      selectAll: function  (argument) {
        // body...
        var dtd = $.Deferred();
        db.find({}, function (err, docs) {
          // body...
          if (err) {
            dtd.reject(err);
            return;
          };
          dtd.resolve(docs);
        });

        return dtd.promise();
      }
    };
  });
