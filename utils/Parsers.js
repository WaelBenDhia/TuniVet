"use strict";

const Contract = require('../utils/TunivetContract.js');

var formatDate = date => {
	return require('moment')(date).format('YYYY-MM-DD HH:mm:ss');
};

var parseArticlesFromRowData = rows => {
	var articles = [];
	for (var i = 0; i < rows.length; i++)
		articles.push({
			id: rows[i][Contract.ArticlesEntry.ID],
			name: rows[i][Contract.ArticlesEntry.NAME],
			author: rows[i][Contract.ArticlesEntry.AUTHOR],
			writeDate: formatDate(rows[i][Contract.ArticlesEntry.WRITE_DATE]),
			updateDate: formatDate(rows[i][Contract.ArticlesEntry.LAST_UPDATE_DATE]),
			condition: rows[i][Contract.ArticlesEntry.CONTENT]
		});
	return articles;
};

var parsePatientsFromRowData = rows => {
	var patients = [];
	for (var i = 0; i < rows.length; i++)
		patients.push({
			id: rows[i][Contract.PatientsEntry.ID],
			name: rows[i][Contract.PatientsEntry.NAME],
			entryDate: formatDate(rows[i][Contract.PatientsEntry.ENTRY_DATE]),
			exitDate: formatDate(rows[i][Contract.PatientsEntry.EXIT_DATE]),
			updateDate: formatDate(rows[i][Contract.PatientsEntry.UPDATE_DATE]),
			condition: rows[i][Contract.PatientsEntry.CONDITION],
			tarif: rows[i][Contract.PatientsEntry.TARIF],
			price: Math.ceil(Math.abs(new Date() - (new Date(rows[i][Contract.PatientsEntry.EXIT_DATE]) || new Date(rows[i][Contract.ArticlesEntry.ENTRY_DATE]))) / 86400000) * rows[i][Contract.PatientsEntry.TARIF]
		});
	return patients;
};

var parseUsersFromRowData = rows => {
	var users = [];
	for (var i = 0; i < rows.length; i++)
		users.push({
			username: rows[i][Contract.UsersEntry.USERNAME],
			email: rows[i][Contract.UsersEntry.EMAIL],
			firstName: rows[i][Contract.UsersEntry.FIRST_NAME],
			lastName: rows[i][Contract.UsersEntry.LAST_NAME],
			password: rows[i][Contract.UsersEntry.PASSWORD],
			salt: rows[i][Contract.UsersEntry.SALT]
		});
	return users;
};

var parseBackgroundImagesFromRowData = rows => {
	var images = [];
	for (var i = 0; i < rows.length; i++)
		images.push({
			id: rows[i][Contract.BackgroundImagesEntry.ID],
			imageData: rows[i][Contract.BackgroundImagesEntry.IMAGE_DATA]
		});
	return images;
};

var parseLandingPageInfoFromRowData = rows => {
	var info = [];
	for (var i = 0; i < rows.length; i++)
		info.push({
			id: rows[i][Contract.LandingPageInfoEntry.ID],
			title: rows[i][Contract.LandingPageInfoEntry.TITLE],
			body: rows[i][Contract.LandingPageInfoEntry.BODY]
		});
	return info;
};

module.exports = {
	parseArticlesFromRowData: parseArticlesFromRowData,
	parsePatientsFromRowData: parsePatientsFromRowData,
	parseUsersFromRowData: parseUsersFromRowData,
	parseBackgroundImagesFromRowData: parseBackgroundImagesFromRowData,
	parseLandingPageInfoFromRowData: parseLandingPageInfoFromRowData
};