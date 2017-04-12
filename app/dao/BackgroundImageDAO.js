"use strict";

const Contract = require('../../utils/TunivetContract.js');
const Parsers = require('../../utils/Parsers.js');

var connection = require('../../utils/ConnectionHandler.js').connection;

var getBackgroundImage = (id) => {
	var query = `select * from ${Contract.BackgroundImagesEntry.TABLE_NAME} where ${Contract.BackgroundImagesEntry.ID} ='${id}'`;
	return new Promise((fulfill, reject) =>
		connection
		.query(query)
		.then(rows => fulfill(Parsers.parseBackgroundImagesFromRowData(rows)[0]))
		.catch(err => reject(err))
	);
};

var updateBackgroundImage = (image) => {
	return new Promise((fulfill, reject) => {
		connection
			.query(`update ${Contract.BackgroundImagesEntry.TABLE_NAME} set \`${Contract.BackgroundImagesEntry.IMAGE_DATA}\` = '${image.imageData}' where \`${Contract.BackgroundImagesEntry.ID}\` = '${image.id}' ;`)
			.then(OkPacket => fulfill(OkPacket))
			.catch(err => reject(err));
	});
};

module.exports = {
	getBackgroundImage: getBackgroundImage,
	updateBackgroundImage: updateBackgroundImage
};