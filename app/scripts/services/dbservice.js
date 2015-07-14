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
    var Datastore = require('nedb')
    , path = require('path');

    var DataPath = path.join(require('nw.gui').App.dataPath, 'privateData');
    var dataStoreCollection = {
    };

    // Public API here
    return {
      getDataStore: function (storeName) {
        if (storeName in dataStoreCollection) {
          return dataStoreCollection[storeName];
        };
        var db = new Datastore({ filename: path.join(DataPath, storeName),
            autoload: true });
        dataStoreCollection[storeName] = db;
        return db;
      },

      insert: function  (argument) {
        var dtd = $.Deferred();
        // body...
        // var doc = {
        //   name: 'hello',
        //   path: 'helloSong'
        // };

        // db.insert(doc, function (err, newDoc) {   // Callback is optional
        //   if (err) {
        //     dtd.reject(err);
        //     return;
        //   };
        //   // newDoc is the newly inserted document, including its _id
        //   // newDoc has no key called notToBeSaved since its value was undefined
        //   dtd.resolve(newDoc);
        // });

        return dtd.promise();
      },

      count: function  (argument) {
        // body...
        var dtd = $.Deferred();
        // db.count({}, function (err, count) {
        //   if (err) {
        //     dtd.reject(err);
        //     return;
        //   };
        //   dtd.resolve(count);
        // });

        return dtd.promise();
      },

      selectAll: function  (argument) {
        // body...
        var dtd = $.Deferred();
        // db.find({}, function (err, docs) {
        //   // body...
        //   if (err) {
        //     dtd.reject(err);
        //     return;
        //   };
        //   dtd.resolve(docs);
        // });

        return dtd.promise();
      }
    };
  });
