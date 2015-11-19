(function (Database) {
    'use strict';

    var async     = require('async'),

        nodebb    = require('./nodebb'),
        db        = nodebb.db,
        user      = nodebb.user,
        constants = require('./constants'),
        namespace = constants.NAMESPACE,
        moment    = require('moment'),
        signInNamepsace = constants.SIGNIN_NAMESPACE;

    //FIXME Remove Points object if User is deleted or create utility method for ACP
    Database.delete = function (uid, done) {
        db.sortedSetRemove(namespace, uid, done);
    };

    Database.getPoints = function (uid, done) {
        db.sortedSetScore(namespace, uid, done);
    };

    Database.setSignInTimestamp = function(uid, done) {
        var str = moment().format();
        console.log(str);
        db.setObjectField(signInNamepsace + uid, "signin_timestamp", str, done);
    }

    Database.getSignInTimestamp = function(uid, done) {
        db.getObjectField(signInNamepsace + uid, "signin_timestamp", done);
    }
    
    Database.getContinDays = function(uid, done) {
        db.getObjectField(signInNamepsace + uid, "contin_days", done);
    }
    
    Database.incrContinDays = function(uid, done) {
        db.incrObjectFieldBy(signInNamepsace + uid, "contin_days", 1, done);
    }

    Database.getUsers = function (limit, done) {
        async.waterfall([
            async.apply(db.getSortedSetRevRangeWithScores, namespace, 0, limit),
            function (scoredUsers, next) {
                var scores = {};
                var ids = scoredUsers.map(function (scoredUser) {
                    scores[scoredUser.value] = scoredUser.score;
                    return scoredUser.value;
                });
                user.getUsersData(ids, function (error, users) {
                    if (error) {
                        return next(error);
                    }
                    var usersWithScores = users.map(function (userData) {
                        userData.points = scores[userData.uid] || 0;
                        return userData;
                    });
                    next(null, usersWithScores);
                });
            }
        ], done);
    };

    Database.incrementBy = function (uid, increment, done) {
        db.sortedSetIncrBy(namespace, increment, uid, done);
    };

})(module.exports);
