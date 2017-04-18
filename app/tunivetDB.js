"use strict";

const Contract = require('../utils/TunivetContract.js');
const ConnectionHandler = require('../utils/ConnectionHandler.js');

const PatientDAO = require('./dao/PatientDAO');
const InfoDAO = require('./dao/LandingPageInfoDAO');
const UserDAO = require('./dao/UserDAO');
const ArticleDAO = require('./dao/ArticleDAO');

var connection = ConnectionHandler.connection;

var dropTables = () => {
	var dropQuery = `drop table if exists ${Contract.ArticlesEntry.TABLE_NAME}, ${Contract.PatientsEntry.TABLE_NAME}, ${Contract.UsersEntry.TABLE_NAME};`;
	return new Promise((fulfill, reject) =>
		connection.query(dropQuery)
		.then(rows => fulfill(rows))
		.catch(err => reject(err))
	);
};

var createTables = () => {

	var createUsersQuery = `create table if not exists ${Contract.UsersEntry.TABLE_NAME}(\`${Contract.UsersEntry.USERNAME}\` varchar(255) not null primary key,\`${Contract.UsersEntry.FIRST_NAME}\` varchar(255),\`${Contract.UsersEntry.LAST_NAME}\` varchar(255),\`${Contract.UsersEntry.EMAIL}\` varchar(255) not null unique,\`${Contract.UsersEntry.PASSWORD}\` varchar(255) not null,\`${Contract.UsersEntry.SALT}\` varchar(255) not null);`;

	var createPatientsQuery = `create table if not exists ${Contract.PatientsEntry.TABLE_NAME}(\`${Contract.PatientsEntry.ID}\` int not null auto_increment primary key,\`${Contract.PatientsEntry.NAME}\` varchar(255) not null,\`${Contract.PatientsEntry.ENTRY_DATE}\` timestamp default current_timestamp not null,\`${Contract.PatientsEntry.EXIT_DATE}\` timestamp null,\`${Contract.PatientsEntry.UPDATE_DATE}\` timestamp default current_timestamp on update current_timestamp,\`${Contract.PatientsEntry.CONDITION}\` varchar(255) not null, \`${Contract.PatientsEntry.TARIF}\` FLOAT);`;

	var createArticlesQuery = `create table if not exists ${Contract.ArticlesEntry.TABLE_NAME}(\`${Contract.ArticlesEntry.ID}\` int not null auto_increment primary key,\`${Contract.ArticlesEntry.NAME}\` varchar(255) not null,\`${Contract.ArticlesEntry.AUTHOR}\` varchar(255) not null,\`${Contract.ArticlesEntry.WRITE_DATE}\` timestamp default current_timestamp,\`${Contract.ArticlesEntry.LAST_UPDATE_DATE}\` timestamp default current_timestamp on update current_timestamp,\`${Contract.ArticlesEntry.CONTENT}\` text,foreign key (author) references users(username));`;

	var createLandingPageInfoQuery = `create table if not exists ${Contract.LandingPageInfoEntry.TABLE_NAME}(\`${Contract.LandingPageInfoEntry.ID}\` int not null auto_increment primary key,\`${Contract.LandingPageInfoEntry.TITLE}\` varchar(255),\`${Contract.LandingPageInfoEntry.BODY}\` text);`;

	var fuls = [];
	return new Promise((fulfill, reject) =>
		connection
		.query(createUsersQuery)
		.then(success => {
			fuls.push(`${Contract.UsersEntry.TABLE_NAME} table created successfully.`);
			return connection.query(createPatientsQuery);
		})
		.catch(err => reject(err + "\n" + createUsersQuery))
		.then(success => {
			fuls.push(`${Contract.PatientsEntry.TABLE_NAME} table created successfully.`);
			return connection.query(createArticlesQuery);
		})
		.catch(err => reject(err + "\n" + createPatientsQuery))
		.then(rows => {
			fuls.push(`${Contract.ArticlesEntry.TABLE_NAME} table created successfully.`);
			return connection.query(createLandingPageInfoQuery);
		})
		.catch(err => reject(err + "\n" + createArticlesQuery))
		.then(rows => {
			fuls.push(`${Contract.LandingPageInfoEntry.TABLE_NAME} table created successfully.`);
			fulfill(fuls);
		})
		.catch(err => reject(err + "\n" + createLandingPageInfoQuery))
	);
};

module.exports = {
	connection: connection,
	dropTables: dropTables,
	createTables: createTables,
	authenticateUser: UserDAO.authenticateUser,
	getUser: UserDAO.getUser,
	insertUserIfNotExists: UserDAO.insertUserIfNotExists,
	getUserByEmail: UserDAO.getUserByEmail,
	insertPatient: PatientDAO.insertPatient,
	updatePatient: PatientDAO.updatePatient,
	deletePatient: PatientDAO.deletePatient,
	getPatient: PatientDAO.getPatient,
	insertArticle: ArticleDAO.insertArticle,
	getArticle: ArticleDAO.getArticle,
	getPatients: PatientDAO.getPatients,
	searchPatients: PatientDAO.searchPatients,
	getInfo: InfoDAO.getAllLandingPageInfo,
	updateInfo: InfoDAO.updateLandingPageInfo
};