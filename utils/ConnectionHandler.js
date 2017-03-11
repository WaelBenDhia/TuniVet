const MySql = require('mysql')

var db_host = process.env.MYSQL_HOST || "localhost"
var db_user = process.env.MYSQL_USER || "wael"
var db_password = process.env.MYSQL_PASSWORD || ""
var db_database = process.env.MYSQL_DATABASE || "myapp_test"

const pool = MySql.createPool({
	connectionLimit : 100,
	host : db_host,
	user : db_user,
	password : db_password,
	database : db_database,
	debug : false
})

var getConnection = () => {
	return new Promise((fulfill, reject) => {
		pool.getConnection((err, connection) => {
			if(err)
				reject(err)
			else
				fulfill(connection)
		})
	})
}

module.exports = {
	getConnection: getConnection
}