var parsePatientsFromRowData = rows => {
	var patients = []
	for(var i = 0; i < rows.length; i++)
		patients.push({
			id: rows[i].id,
			name: rows[i].name,
			entryDate: rows[i].entry_date,
			exitDate: rows[i].exit_date,
			updateDate: rows[i].update_date,
			condition: rows[i].condition
		})
	return patients
}

var parseUsersFromRowData = rows => {
	var users = []
	for(var i = 0; i < rows.length; i++)
		users.push({
			username: rows[i].username,
			email: rows[i].email,
			firstName: rows[i].first_name,
			lastName: rows[i].last_name,
			password: rows[i].password,
			salt: rows[i].salt
		})
	return users
}

module.exports = {
	parsePatientsFromRowData: parsePatientsFromRowData,
	parseUsersFromRowData: parseUsersFromRowData
}