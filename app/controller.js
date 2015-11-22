(function (Controller) {
    'use strict';

    var async = require('async'),
        nconf = require('./nodebb').nconf,

        constants = require('./constants'),
        database = require('./database'),
        settings = require('./settings'),
        moment = require('moment');

    Controller.getTopUsers = function (done) {
        database.getUsers(settings.get().maxUsers - 1, function (error, users) {
            if (error) {
                return done(error);
            }

            var topUsers = {
                users: users,
                relative_path: nconf.get('relative_path'),
                userTemplate: settings.getUserTemplate()
            };

            Controller.getResponseWithSettings(topUsers, done);
        });
    };

    Controller.getResponseWithSettings = function (response, done) {
        response.pointsSettings = settings.get();
        done(null, response);
    };

    Controller.signIn = function (req, res, done) {
        function failed(err) {
            res.status(400).send("Failed");
        }

        function succeeded(points) {
            res.send(points);
        }

        if (parseInt(req.uid, 10) == 0) {
            //Not logged in
            return failed();
        }


        database.getSignInTimestamp(req.uid, function (err, data) {
            var incrContin = false;

            if (err) {
                return failed(err);
            }

            if (data) {
                var lastSignTime = moment(data);
                var now = moment();
                if (!lastSignTime.isBefore(now, 'day')) {
                    return failed();
                }

                if (now.subtract(1, 'day').isSame(lastSignTime, 'day')) {
                    incrContin = true;
                }
            }

            database.setSignInTimestamp(req.uid, function (err) {
                database.incrementBy(req.uid, settings.get().signInWeight, function (error, points) {
                    if (error) {
                        return failed(error);
                    }


                    if (incrContin) {
                        database.incrContinDays(req.uid, function (err) {
                            if (err)
                                return failed(err);

                            return succeeded(points);
                        });
                    } else {
                        database.oneContinDays(req.uid, function (err) {
                            if (err)
                                return failed(err);
                            
                            return succeeded(points);
                        });
                    }
                });
            });
        });
    };

})(module.exports);
