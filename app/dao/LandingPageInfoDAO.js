"use strict";

const Contract = require('../../utils/TunivetContract.js');
const Parsers = require('../../utils/Parsers.js');

var connection = require('../../utils/ConnectionHandler.js').connection;

var getAllLandingPageInfo = () => {
	var query = `select * from ${Contract.LandingPageInfoEntry.TABLE_NAME}`;
	return new Promise((fulfill, reject) =>
		connection
		.query(query)
		.then(rows => fulfill(Parsers.parseLandingPageInfoFromRowData(rows)))
		.catch(err => reject(err))
	);
};

var updateLandingPageInfo = info => {
	return new Promise((fulfill, reject) =>
		connection
		.query(`update ${Contract.LandingPageInfoEntry.TABLE_NAME} set \`${Contract.LandingPageInfoEntry.TITLE}\` = '${info.title}',  \`${Contract.LandingPageInfoEntry.BODY}\` = '${info.body}' where \`${Contract.LandingPageInfoEntry.ID}\` = '${info.id}' ;`)
		.then(OkPacket => fulfill(OkPacket))
		.catch(err => reject(err))
	);
};

module.exports = {
	getAllLandingPageInfo: getAllLandingPageInfo,
	updateLandingPageInfo: updateLandingPageInfo
};