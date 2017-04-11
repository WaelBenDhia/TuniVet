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
			var query = `insert into ${Contract.PatientsEntry.TABLE_NAME}(`;
			var date = new Date(patient.exitDate);
			var formatedMysqlString = (new Date((new Date((new Date(date)).toISOString())).getTime() - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, 19).replace('T', ' ');

			if (patient.condition)
				query += `\`${Contract.PatientsEntry.CONDITION}\``;
			if (patient.condition && patient.name)
				query += ", ";
			if (patient.name)
				query += `\`${Contract.PatientsEntry.NAME}\``;
			if (patient.name && patient.exitDate && !isNaN(date.getTime()))
				query += ", ";
			if (patient.exitDate && !isNaN(date.getTime()))
				query += `\`${Contract.PatientsEntry.EXIT_DATE}\``;

			query += `) values (`;

			if (patient.condition)
				query += `'${patient.condition}'`;
			if (patient.condition && patient.name)
				query += ", ";
			if (patient.name)
				query += `'${patient.name}'`;
			if (patient.name && patient.exitDate && !isNaN(date.getTime()))
				query += ", ";
			if (patient.exitDate && !isNaN(date.getTime()))
				query += `'${formatedMysqlString}'`;

			query += `);`;

			getConnection()
				.then(con => con
					.query(
						query,
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
			var query = `update ${Contract.PatientsEntry.TABLE_NAME} set`;
			var date = new Date(patient.exitDate);
			if (patient.condition)
				query += ` \`${Contract.PatientsEntry.CONDITION}\`='${patient.condition}'`;
			if (patient.name)
				query += `, \`${Contract.PatientsEntry.NAME}\`='${patient.name}'`;
			if (patient.exitDate && !isNaN(date.getTime())) {
				var formatedMysqlString = (new Date((new Date((new Date(date)).toISOString())).getTime() - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, 19).replace('T', ' ');
				query += `, \`${Contract.PatientsEntry.EXIT_DATE}\`='${formatedMysqlString}'`;
			}
			query += ` where \`${Contract.PatientsEntry.ID}\`=${patient.id};`;
			getConnection()
				.then(con => con
					.query(
						query,
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

var deletePatient = (id, user) => {
	return new Promise((fulfill, reject) => {
		getConnection()
			.then(con => con
				.query(
					`delete from ${Contract.PatientsEntry.TABLE_NAME} where ${Contract.PatientsEntry.ID} = '${id}'`,
					(err, result) => {
						con.release();
						if (err)
							reject(err);
						else
							fulfill(result);
					})
			)
			.catch(err => reject(err));
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

var searchPatients = (filterName, pageNumber, itemsPerPage) => {
	return new Promise((fulfill, reject) => {
		var patients = {
			count: 0,
			data: []
		};
		var query = `select * from ${Contract.PatientsEntry.TABLE_NAME} `;
		if (filterName)
			query += `where instr( lower(${Contract.PatientsEntry.NAME}), lower('${filterName}')) `;
		query += `order by ${Contract.PatientsEntry.ENTRY_DATE} desc `;
		query += `limit ${pageNumber * itemsPerPage}, ${itemsPerPage}`;
		var countQuery = `select count(*) as 'count' from ${Contract.PatientsEntry.TABLE_NAME} `;
		if (filterName)
			countQuery += `where instr( lower(${Contract.PatientsEntry.NAME}), lower('${filterName}')) `;
		getConnection()
			.then(con => con
				.query(query, (err, rows) => {
					if (err) {
						con.release();
						reject(err);
					} else {
						patients.data = (Parsers.parsePatientsFromRowData(rows));
						con.query(countQuery, (err, rows) => {
							con.release();
							if (err)
								reject(err);
							else {
								patients.count = rows[0].count;
								fulfill(patients);
							}
						});
					}
				})
			)
			.catch(err => reject(err));
	});
};

module.exports = {
	insertPatient: insertPatient,
	updatePatient: updatePatient,
	deletePatient: deletePatient,
	getPatient: getPatient,
	getPatients: getPatients,
	searchPatients: searchPatients
};