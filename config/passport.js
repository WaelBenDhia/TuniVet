"use strict";

const LocalStrategy = require('passport-local');
const DB = require('../app/tunivetDB.js');

module.exports = (passport) => {

	passport.serializeUser((user, done) => done(null, user.username));

	passport.deserializeUser((username, done) => {
		DB.getUser(username)
			.then(user => done(null, user))
			.catch(err => done(err));
	});

	passport.use(new LocalStrategy(
		(username, password, done) => {
			DB.authenticateUser({ username, password })
				.then(user => {
					return done(null, user);
				})
				.catch(err => {
					done(null, false, { message: err });
				});
		}
	));
};