"use strict";

const Contract = require('../../utils/TunivetContract.js');
const Parsers = require('../../utils/Parsers.js');
const PasswordHelper = require('../../utils/password.js');

var connection = require('../../utils/ConnectionHandler.js').connection;

var getArticle = (id) => {
	var query = `select * from ${Contract.ArticlesEntry.TABLE_NAME} where ${Contract.ArticlesEntry.ID} ='${id}'`;
	return new Promise((fulfill, reject) =>
		connection
		.query(query)
		.then(rows => fulfill(Parsers.parseArticlesFromRowData(rows)[0]))
		.catch(err => reject(err))
	);
};

var insertArticle = (article, user) => {
	return new Promise((fulfill, reject) => {
		var err;
		if (!article.name)
			err = "Article is missing name.";
		if (!article.content)
			err = (err ? err + '\n' : '') + "Article is missing body.";
		if (err)
			reject(err);
		else {
			article.author = user.username;
			connection.query(`insert into ${Contract.ArticlesEntry.TABLE_NAME}(\`${Contract.ArticlesEntry.NAME}\`,\`${Contract.ArticlesEntry.AUTHOR}\`,\`${Contract.ArticlesEntry.CONTENT}\`) values ('${article.name}', '${article.author}', '${article.content}')`)
				.then(OkPacket => fulfill(OkPacket.insertId))
				.catch(err => reject(err));
		}
	});
};

var updateArticle = (article, user) => {
	return new Promise((fulfill, reject) => {
		var err;
		if (!article.id)
			err = "Article is missing id";
		if (!article.name)
			err = (err ? err + '\n' : '') + "Article is missing name.";
		if (!article.content)
			err = (err ? err + '\n' : '') + "Article is missing body";
		if (err)
			reject(err);
		else {
			article.author = user.username;
			connection.query(
					`update ${Contract.ArticlesEntry.TABLE_NAME} sset \`${Contract.ArticlesEntry.NAME}\` = '${article.name}', sset \`${Contract.ArticlesEntry.CONTENT}\` = '${article.content}' where \`${Contract.ArticlesEntry.ID}\` = '${article.id}' ;`)
				.then(OkPacket => fulfill(OkPacket))
				.catch(err => reject(err));
		}
	});
};

module.exports = {
	getArticle: getArticle,
	insertArticle: insertArticle,
	updateArticle: updateArticle
};