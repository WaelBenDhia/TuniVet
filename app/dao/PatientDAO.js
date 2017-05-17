"use strict";

const Contract = require('../../utils/TunivetContract.js');
const Parsers = require('../../utils/Parsers.js');
const PasswordHelper = require('../../utils/password.js');

var connection = require('../../utils/ConnectionHandler.js').connection;

var insertPatient = patient => {
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

			query += `\`${Contract.PatientsEntry.CONDITION}\``;
			query += `, \`${Contract.PatientsEntry.NAME}\``;
			query += `, \`${Contract.PatientsEntry.EXIT_DATE}\``;
			query += `,  \`${Contract.PatientsEntry.TARIF}\``;

			query += `) values (`;

			query += `'${patient.condition}'`;
			query += `, '${patient.name}'`;
			if (patient.exitDate && !isNaN(date.getTime()))
				query += `, '${formatedMysqlString}'`;
			else
				query += `, null`;
			query += `, '${patient.tarif}'`;

			query += `);`;
			console.log(query);
			connection
				.query(query)
				.then(OkPacket => fulfill(OkPacket.insertId))
				.catch(err => reject(err));
		}
	});
};


var updatePatient = patient => {
	function generateSetClause(propertyName) {
		if (patient[propertyName])
			return ` \`${Contract.PatientsEntry[propertyName.toUpperCase()]}\`='${patient[propertyName]}'`;
		return '';
	}
	return new Promise((fulfill, reject) => {
		if (!patient.id)
			reject("Patient is missing id");
		else if (!patient.condition)
			reject("Patient is missing condition.");
		else {
			var query = `update ${Contract.PatientsEntry.TABLE_NAME} set`;
			var date = new Date(patient.exitDate);
			var sets = generateSetClause('condition');
			sets += (sets ? ',' : '') + generateSetClause('name');
			sets += (sets ? ',' : '') + generateSetClause('tarif');
			if (patient.exitDate && !isNaN(date.getTime())) {
				var formatedMysqlString = new Date(new Date(date).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ');
				sets += `${sets ? ',' : ''} \`${Contract.PatientsEntry.EXIT_DATE}\`='${formatedMysqlString}'`;
			}
			query += sets + ` where \`${Contract.PatientsEntry.ID}\`=${patient.id};`;
			return connection.query(query)
				.then(fulfill)
				.catch(reject);
		}
	});
};

var deletePatient = id => {
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