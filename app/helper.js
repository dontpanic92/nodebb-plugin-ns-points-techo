(function (Helper) {
    'use strict';
    var moment = require('moment');

    var database = require('./database');

    Helper.checkLoggedIn = function(uid) {
        return !(parseInt(uid, 10) == 0);
    }

    Helper.checkCanSignIn = function (uid, callback) {
        if (!Helper.checkLoggedIn()) {
            return callback(null, false);
        }
        
        database.getSignInTimestamp(uid, function (err, data) {
            if (err) {
                return callback(err);
            }
            
            console.log(data);
            if (data) {
                var lastSignTime = moment(data);
                var now = moment();
                if (!lastSignTime.isBefore(now, 'day')) {
                    return callback(null, false);
                }
            }
            
            return callback(null, true);
        });
    };

})(module.exports);