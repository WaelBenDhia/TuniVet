const Contract = require('../../utils/TunivetContract.js');
const Parsers = require('../../utils/Parsers.js');

var getConnection = require('../../utils/ConnectionHandler.js').getConnection();

var getBackgroundImage = (id) => {
	return new Promise((fulfill, reject) => {
		var query = `select * from ${Contract.BackgroundImagesEntry.TABLE_NAME} where ${Contract.BackgroundImagesEntry.ID} ='${id}'`;
		getConnection()
			.then(con => con
				.query(query, (err, rows) => {
					con.release();
					if (err)
						reject(err);
					else
						fulfill(Parsers.parseBackgroundImagesFromRowData(rows)[0]);
				})
			)
			.catch(err => reject(err));
	});
};

var updateBackgroundImage = (image) => {
	return new Promise((fulfill, reject) => {
		getConnection()
			.then(con => con
				.query(
					`update ${Contract.BackgroundImagesEntry.TABLE_NAME} set \`${Contract.BackgroundImagesEntry.IMAGE_DATA}\` = ? where \`${Contract.BackgroundImagesEntry.ID}\` = ? ;`, [
						image.imageData,
						image.id
					],
					(err, OkPacket) => {
						con.release();
						if (err)
							reject(err);
						else
							fulfill(OkPacket);
					})
			)
			.catch(err => reject(err));
	});
};

module.exports = {
	getBackgroundImage: getBackgroundImage,
	updateBackgroundImage: updateBackgroundImage
};