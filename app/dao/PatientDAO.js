const Contract = require('../../utils/TunivetContract.js');
const Parsers = require('../../utils/Parsers.js');
const PasswordHelper = require('../../utils/password.js');

var getConnection = require('../../utils/ConnectionHandler.js').getConnection;

var insertPatient = (patient, user) => {
	return new Promise((fulfill, reject) => {
		var err;
		if (!patient.name)
			err = "Patient is missing name.";
		if (!patient.condition)
			err = (err ? err + '\n' : '') + "Patient is missing condition.";
		if (err)
			reject(err);
		else {
			getConnection()
				.then(con => con
					.query(
						`insert into ${Contract.PatientsEntry.TABLE_NAME}(\`${Contract.PatientsEntry.NAME}\`,\`${Contract.PatientsEntry.CONDITION}\`)values (?, ?)`, [
							patient.name,
							patient.condition
						],
						(err, OkPacket) => {
							con.release();
							if (err)
								reject(err);
							else
								fulfill(OkPacket.insertId);
						})
				)
				.catch(err => reject(err));
		}
	});
};

var updatePatient = (patient, user) => {
	return new Promise((fulfill, reject) => {
		var err;
		if (!patient.id)
			err = "Patient is missing id";
		if (!patient.condition)
			err = (err ? err + '\n' : '') + "Patient is missing condition.";
		if (err)
			reject(err);
		else {
			getConnection()
				.then(con => con
					.query(
						`update ${Contract.PatientsEntry.TABLE_NAME} set \`${Contract.PatientsEntry.CONDITION}\` = ? where \`${Contract.PatientsEntry.ID}\` = ? ;`, [
							patient.condition,
							patient.id
						],
						(err, result) => {
							con.release();
							if (err)
								reject(err);
							else
								fulfill(result);
						})
				)
				.catch(err => reject(err));
		}
	});
};

var getPatient = (id) => {
	return new Promise((fulfill, reject) => {
		var query = `select * from ${Contract.PatientsEntry.TABLE_NAME} where ${Contract.PatientsEntry.ID} ='${id}'`;
		getConnection()
			.then(con => con
				.query(query, (err, rows) => {
					con.release();
					if (err)
						reject(err);
					else
						fulfill(Parsers.parsePatientsFromRowData(rows)[0]);
				})
			)
			.catch(err => reject(err));
	});
};

var getPatients = () => {
	return new Promise((fulfill, reject) => {
		var query = `select * from ${Contract.PatientsEntry.TABLE_NAME}`;
		getConnection()
			.then(con => con
				.query(query, (err, rows) => {
					con.release();
					if (err)
						reject(err);
					else
						fulfill(Parsers.parsePatientsFromRowData(rows));
				})
			)
			.catch(err => reject(err));
	});
};

module.exports = {
	insertPatient: insertPatient,
	updatePatient: updatePatient,
	getPatient: getPatient,
	getPatients: getPatients
};