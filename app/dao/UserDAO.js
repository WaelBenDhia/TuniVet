"use strict";

const Contract = require('../../utils/TunivetContract.js');
const Parsers = require('../../utils/Parsers.js');
const PasswordHelper = require('../../utils/password.js');
const IsEmail = require('isemail');

var connection = require('../../utils/ConnectionHandler.js').connection;


var getUser = (username) => {
	var query = `select * from ${Contract.UsersEntry.TABLE_NAME} where ${Contract.UsersEntry.USERNAME} ='${username}'`;
	return new Promise((fulfill, reject) =>
		connection.query(query)
		.then(rows => fulfill(Parsers.parseUsersFromRowData(rows)[0]))
		.catch(err => reject(err))
	);
};


var getUserByEmail = (email) => {
	var query = `select * from ${Contract.UsersEntry.TABLE_NAME} where ${Contract.UsersEntry.EMAIL} ='${email}'`;
	return new Promise((fulfill, reject) =>
		connection.query(query)
		.then(rows => fulfill(Parsers.parseUsersFromRowData(rows)[0]))
		.catch(err => reject(err))
	);
};

var authenticateUser = (user) => {
	return new Promise((fulfill, reject) => {
		var err;
		if (!user.email && !user.username)
			err = `Il faut fournir un nom d'utilisateur ou une adresse e-mail.`;
		if (err)
			reject(err);
		else {
			var getUserPromise = user.username ? getUser(user.username) : getUserByEmail(user.email);
			var inDbUser;
			getUserPromise
				.then(dbUser => {
					if (!dbUser)
						reject("Le nom d'utilisateur ou l'adresse e-mail fournie est incorrecte.");
					else {
						inDbUser = dbUser;
						return PasswordHelper.hash(user.password, dbUser.salt);
					}
				})
				.catch(err => reject(err))
				.then(passTheSalt => {
					if (passTheSalt.password == inDbUser.password)
						fulfill(inDbUser);
					else
						reject('Le mot de passe fourni est incorrect.');
				})
				.catch(err => reject(err));
		}
	});
};

var insertUserIfNotExists = (user) => {
	return new Promise((fulfill, reject) => {
		var err;
		if (!user.username)
			err = "Nom d'utilisateur absent.";
		if (!user.email)
			err = (err ? err + '\n' : '') + "Adresse e-mail absente.";
		else if (!IsEmail.validate(user.email))
			err = (err ? err + '\n' : '') + "L'adresse e-mail fournie est incorrecte.";
		if (!user.password)
			err = (err ? err + '\n' : '') + "Mot de passe absent.";
		if (err)
			reject(err);
		else {
			getUser(user.username)
				.then(dbUser => {
					if (dbUser)
						reject(`Un utilisateur avec le nom ${user.username} existe déjà.`);
					else
						return getUserByEmail(user.email);
				})
				.catch(err => reject(err))
				.then(dbUser => {
					if (dbUser)
						reject(`L'adresse e-mail ${user.email} existe déjà.`);
					else
						return PasswordHelper.hash(user.password);
				})
				.catch(err => reject(err))
				.then(passwordAndSalt => {
					user.password = passwordAndSalt.password;
					user.salt = passwordAndSalt.salt;
					return connection.query(`insert into ${Contract.UsersEntry.TABLE_NAME}(\`${Contract.UsersEntry.USERNAME}\`,\`${Contract.UsersEntry.EMAIL}\`,\`${Contract.UsersEntry.FIRST_NAME}\`,\`${Contract.UsersEntry.LAST_NAME}\`,\`${Contract.UsersEntry.PASSWORD}\`,\`${Contract.UsersEntry.SALT}\`) values ('${user.username}', '${user.email}', '${user.firstName}', '${user.lastName}', '${user.password}', '${user.salt}')`);
				})
				.catch(err => reject(err))
				.then(OkPacket => fulfill(OkPacket))
				.catch(err => reject(err));
		}
	});
};


var updateUser = (user, oldUser) => {
	return new Promise((fulfill, reject) => {
		var query = `update ${Contract.UsersEntry.TABLE_NAME} set `;
		var updates = "";
		if (user.email)
			updates += `\`${Contract.UsersEntry.EMAIL}\`='${user.email}`;

		if (user.firstName) {
			if (updates)
				updates += ', ';
			updates += `\`${Contract.UsersEntry.FIRST_NAME}\`='${user.firstName}`;
		}

		if (user.lastName) {
			if (updates)
				updates += ', ';
			updates += `\`${Contract.UsersEntry.LAST_NAME}\`='${user.lastName}`;
		}
		if (!updates) {
			reject("Nothing to update.");
		} else {
			updates += ` where \`${Contract.UsersEntry.USERNAME}\` = \`${oldUser.username}\`;`;
			var checkEmail;
			if (user.email)
				checkEmail = getUserByEmail(user.email);
			else
				checkEmail = Promise.resolve(false);
			checkEmail
				.then(dbUser => {
					if (dbUser)
						reject(`L'adresse e-mail ${user.email} existe déjà.`);
					else
						return connection.query(query + updates);
				})
				.catch(err => reject(err))
				.then(OkPacket => fulfill(OkPacket))
				.catch(err => reject(err));
		}
	});
};

var updatePassword = password => {
	return new Promise((fulfill, reject) => {
		if (!password)
			reject("Mot de passe est vide.");
		else {
			PasswordHelper.hash(password)
				.catch(err => reject(err))
				.then(passwordAndSalt => {
					return connection.query(`update \`${Contract.UsersEntry.TABLE_NAME}\ set \`${Contract.UsersEntry.PASSWORD}\` = '${passwordAndSalt.password}', \`${Contract.UsersEntry.SALT}\` = '${passwordAndSalt.salt}'`);
				})
				.catch(err => reject(err))
				.then(OkPacket => fulfill(OkPacket));
		}
	});
};

module.exports = {
	authenticateUser: authenticateUser,
	insertUserIfNotExists: insertUserIfNotExists,
	getUser: getUser,
	getUserByEmail: getUserByEmail,
	updateUser: updateUser,
	updatePassword: updatePassword
};