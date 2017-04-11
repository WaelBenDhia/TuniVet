const Contract = require('../../utils/TunivetContract.js');
const Parsers = require('../../utils/Parsers.js');
const PasswordHelper = require('../../utils/password.js');

var connection = require('../../utils/ConnectionHandler.js').connection;

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

			connection
				.query(query)
				.then(OkPacket => fulfill(OkPacket.insertId))
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
			connection
				.query(query)
				.then(result => fulfill(result))
				.catch(err => reject(err));
		}
	});
};

var deletePatient = (id, user) => {
	return new Promise((fulfill, reject) =>
		connection
		.query(`delete from ${Contract.PatientsEntry.TABLE_NAME} where ${Contract.PatientsEntry.ID} = '${id}'`)
		.then(result => fulfill(result))
		.catch(err => reject(err))
	);
};

var getPatient = (id) => {
	var query = `select * from ${Contract.PatientsEntry.TABLE_NAME} where ${Contract.PatientsEntry.ID} ='${id}'`;
	return new Promise((fulfill, reject) => {
		connection
			.query(query)
			.then(rows => {
				if (rows.length === 0)
					reject("Not found.");
				else
					fulfill(Parsers.parsePatientsFromRowData(rows)[0]);
			})
			.catch(err => reject(err));
	});
};

var getPatients = () => {
	var query = `select * from ${Contract.PatientsEntry.TABLE_NAME}`;
	return new Promise((fulfill, reject) => {
		connection
			.query(query)
			.then(rows => fulfill(Parsers.parsePatientsFromRowData(rows)))
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
		connection
			.query(query)
			.then(rows => {
				patients.data = (Parsers.parsePatientsFromRowData(rows));
				return connection.query(countQuery);
			})
			.catch(err => reject(err))
			.then(rows => {
				patients.count = rows[0].count;
				fulfill(patients);
			})
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