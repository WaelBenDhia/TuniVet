const Contract = require('../../utils/TunivetContract.js');
const Parsers = require('../../utils/Parsers.js');

var getConnection = require('../../utils/ConnectionHandler.js').getConnection;

var getAllLandingPageInfo = () => {
	return new Promise((fulfill, reject) => {
		var query = `select * from ${Contract.LandingPageInfoEntry.TABLE_NAME}`;
		getConnection()
			.then(con => con
				.query(query, (err, rows) => {
					con.release();
					if (err)
						reject(err);
					else
						fulfill(Parsers.parseLandingPageInfoFromRowData(rows));
				})
			)
			.catch(err => reject(err));
	});
};

var updateLandingPageInfo = info => {
	return new Promise((fulfill, reject) => {
		getConnection()
			.then(con => con
				.query(
					`update ${Contract.LandingPageInfoEntry.TABLE_NAME} set \`${Contract.LandingPageInfoEntry.TITLE}\` = ?,  \`${Contract.LandingPageInfoEntry.BODY}\` = ? where \`${Contract.LandingPageInfoEntry.ID}\` = ? ;`, [
						info.title,
						info.body,
						info.id
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
	getAllLandingPageInfo: getAllLandingPageInfo,
	updateLandingPageInfo: updateLandingPageInfo
};