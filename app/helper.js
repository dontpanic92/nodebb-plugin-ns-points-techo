(function (Helper) {
    'use strict';
    var moment = require('moment');

    var database = require('./database');

    Helper.checkLoggedIn = function(uid) {
        return !(parseInt(uid, 10) == 0);
    }

    Helper.getSignInTsAndContinDays = function (uid, callback) {
        if (!Helper.checkLoggedIn()) {
            return callback(null, false);
        }
        
        database.getSignInTsAndContinDays(uid, function (err, data) {
            if (err) {
                return callback(err);
            }
            
            var cb_data = {};
            if (data.signin_timestamp) {
                var lastSignTime = moment(data.signin_timestamp);
                var now = moment();
                cb_data.canSignIn = lastSignTime.isBefore(now, 'day');
                cb_data.continDays = cb_data.canSignIn ? (now.subtract(1, 'day').isSame(lastSignTime, 'day') 
                                     ? data.contin_days : 0) : data.contin_days;
                
            } else {
                cb_data.canSignIn = true;
                cb_data.continDays = 0;
            }
            
            return callback(null, cb_data);
        });
    };

})(module.exports);