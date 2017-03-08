const mysql = require('mysql')
const contract = require('../utils/TunivetContract.js')
const parsers = require('../utils/Parsers.js')
const passwordHelper = require('../utils/password.js')
const IsEmail = require('isemail')

var db_host = process.env.MYSQL_HOST || "localhost"
var db_user = process.env.MYSQL_USER || "wael"
var db_password = process.env.MYSQL_PASSWORD || ""
var db_database = process.env.MYSQL_DATABASE || "myapp_test"

const pool = mysql.createPool({
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

var dropTables = () => {
	var dropQuery = "drop table if exists "+contract.BackgroundImagesEntry.TABLE_NAME+", "+contract.ArticlesEntry.TABLE_NAME+", "+contract.PatientsEntry.TABLE_NAME+", "+contract.UsersEntry.TABLE_NAME+";"
	return new Promise((fulfill, reject) => {
		getConnection().then((con) => {
			con.query(dropQuery, (err, rows) => {
				con.release()
				if(err)
					reject(err)
				else
					fulfill(rows)
			})
		})
	})
}

var createTables = () => {
	
	var createUsersQuery = `create table if not exists ${contract.UsersEntry.TABLE_NAME}(`
		+`\`${contract.UsersEntry.USERNAME}\` varchar(255) not null primary key,`
		+`\`${contract.UsersEntry.FIRST_NAME}\` varchar(255),`
		+`\`${contract.UsersEntry.LAST_NAME}\` varchar(255),`
		+`\`${contract.UsersEntry.EMAIL}\`varchar(255) not null unique,`
		+`\`${contract.UsersEntry.PASSWORD}\` varchar(255) not null,`
		+`\`${contract.UsersEntry.SALT}\` varchar(255) not null);`
	
	var createPatientsQuery	= `create table if not exists ${contract.PatientsEntry.TABLE_NAME}(`
		+`\`${contract.PatientsEntry.ID}\` int not null auto_increment primary key,`
		+`\`${contract.PatientsEntry.NAME}\` varchar(255) not null,`
		+`\`${contract.PatientsEntry.ENTRY_DATE}\` timestamp default current_timestamp not null,`
		+`\`${contract.PatientsEntry.EXIT_DATE}\` timestamp null,`
		+`\`${contract.PatientsEntry.UPDATE_DATE}\` timestamp default current_timestamp on update current_timestamp,`
		+`\`${contract.PatientsEntry.CONDITION}\` varchar(255) not null);`
	
	var createArticlesQuery = `create table if not exists ${contract.ArticlesEntry.TABLE_NAME}(`
		+`\`${contract.ArticlesEntry.ID}\` int not null auto_increment primary key,`
		+`\`${contract.ArticlesEntry.NAME}\` varchar(255) not null,`
		+`\`${contract.ArticlesEntry.AUTHOR}\` varchar(255) not null,`
		+`\`${contract.ArticlesEntry.WRITE_DATE}\` timestamp default current_timestamp,`
		+`\`${contract.ArticlesEntry.LAST_UPDATE_DATE}\` timestamp default current_timestamp on update current_timestamp,`
		+`\`${contract.ArticlesEntry.CONTENT}\` text,`
		+"foreign key (author) references users(username));"
	
	var createBackgroundImagesQuery	= `create table if not exists ${contract.BackgroundImagesEntry.TABLE_NAME}(`
		+`\`${contract.BackgroundImagesEntry.ID}\` int not null auto_increment primary key,`
		+`\`${contract.BackgroundImagesEntry.IMAGE_DATA}\` blob);`

	var fuls = []
	return new Promise((fulfill, reject) => {
		getConnection().then((con) => {
			con.query(createUsersQuery, (err, success) => {
				if(err){
					con.release()
					reject(err)
				}else{
					fuls.push(`${contract.UsersEntry.TABLE_NAME} table created successfully.`)
					con.query(createPatientsQuery, (err, success) => {
						if(err){
							con.release()
							reject(err)
						}else{
							fuls.push(`${contract.PatientsEntry.TABLE_NAME} table created successfully.`)
							con.query(createArticlesQuery, (err, success) => {
								if(err)
									reject(err)
								else{
									fuls.push(`${contract.ArticlesEntry.TABLE_NAME} table created successfully.`)
									con.query(createBackgroundImagesQuery, (err, success) =>{
										con.release()
										if(err)
											reject(err)
										else{
											fuls.push(`${contract.BackgroundImagesEntry.TABLE_NAME} table created successfully.`)
											fulfill(fuls)
										}
									})
								}
							})
						}
					})
				}
			})
		})
	})
}

var authenticateUser = (user) =>{
	return new Promise((fulfill, reject) =>{
		var err
		console.log(user)
		if(!user.email && !user.username)
			err = `Il faut fournir un nom d'utilisateur ou une adresse e-mail.`
		if(err)
			reject(err)
		else{
			var getUserPromise = user.username ? getUser(user.username) : getUserByEmail(user.email)
			var inDbUser
			getUserPromise
			.then(dbUser => {
				if(!dbUser)
					reject("Le nom d'utilisateur ou l'adresse e-mail fournie est incorrecte.")
				else{
					inDbUser = dbUser
					return passwordHelper.hash(user.password, dbUser.salt)
				}
			})
			.catch(err => reject(err) )
			.then( passTheSalt => {
				if(passTheSalt.password == inDbUser.password)
					fulfill(inDbUser)
				else
					reject('Le mot de passe fourni est incorrect.')
			})
			.catch(err => reject(err) )
		}
	})
}

var getUser = (username) => {
	return new Promise( (fulfill, reject) => {
		var query = `select * from ${contract.UsersEntry.TABLE_NAME} where ${contract.UsersEntry.USERNAME} ='${username}'`;
		getConnection()
		.then( con => {
			con.query(query, (err, rows) => {
				con.release()
				if(err)
					reject(err)
				else{
					fulfill(parsers.parseUsersFromRowData(rows)[0])
				}
			})
		})
		.catch( err => reject(err) )
	})
}

var insertUserIfNotExists = (user) => {
	return new Promise( (fulfill, reject) => {
		var err
		if(!user.username)
			err = "Nom d'utilisateur absent."
		if(!user.email)
			err = (err ? err + '\n' : '' ) + "Adresse e-mail absente."
		else if(!IsEmail.validate(user.email))
			err = (err ? err + '\n' : '' ) + "L'adresse e-mail fournie est incorrecte."
		if(!user.password)
			err = (err ? err + '\n' : '' ) + "Mot de passe absent."
		if(err)
			reject(err)
		else{
			getUser(user.username)
			.then( dbUser => {
				if(dbUser)
					reject(`Un utilisateur avec le nom ${user.username} existe déjà.`)
				else
					return getUserByEmail(user.email)
			})
			.catch(err => reject(err) )
			.then( dbUser => {
				if(dbUser)
					reject(`Un l'adresse e-mail ${user.email} existe déjà.`)
				else{
					return passwordHelper.hash(user.password)
					
				}
			})
			.catch(err => reject(err) )
			.then( passwordAndSalt => {
				user.password = passwordAndSalt.password
				user.salt = passwordAndSalt.salt
				return getConnection()
			})
			.catch(err => reject(err) )
			.then( con => {
				con.query(
					`insert into ${contract.UsersEntry.TABLE_NAME}(`
					+`\`${contract.UsersEntry.USERNAME}\`,`
					+`\`${contract.UsersEntry.EMAIL}\`,`
					+`\`${contract.UsersEntry.FIRST_NAME}\`,`
					+`\`${contract.UsersEntry.LAST_NAME}\`,`
					+`\`${contract.UsersEntry.PASSWORD}\`,`
					+`\`${contract.UsersEntry.SALT}\`) `
					+`values (?, ?, ?, ?, ? ,?)`,
					[
						user.username,
						user.email,
						user.firstName,
						user.lastName,
						user.password,
						user.salt
					], 
					(err, OkPacket) => {
					if(err)
						reject(err)
					else
						fulfill(OkPacket)
				})
			})
		}
	})
}
var getUserByEmail = (email) => {
	return new Promise( (fulfill, reject) => {
		var query = `select * from ${contract.UsersEntry.TABLE_NAME} where ${contract.UsersEntry.EMAIL} ='${email}'`;
		getConnection()
		.then( con => {
			con.query(query, (err, rows) => {
				con.release()
				if(err)
					reject(err)
				else{
					fulfill(parsers.parseUsersFromRowData(rows)[0])
				}
			})
		})
		.catch( err => reject(err) )
	})
}

var insertArticle = (article, user) => {
	return new Promise((fulfill, reject) => {
		var err
		if(!article.name)
			err = "Article is missing name."
		if(!article.content)
			err = (err ? err + '\n' : '' ) + "Article is missing body."
		if(err)
			reject(err)
		else{
			authenticateUser(user)
			.then( result => {
				return getConnection()
			})
			.catch( err => reject(err) )
			.then( con => {
				article.author = user.username
				con.query(
					`insert into ${contract.ArticlesEntry.TABLE_NAME}`
					+`(\`${contract.ArticlesEntry.NAME}\`,`
					+`\`${contract.ArticlesEntry.AUTHOR}\`,`
					+`\`${contract.ArticlesEntry.CONTENT}\`)`
					+`values (?, ?, ?)`,
					[
						article.name,
						article.author,
						article.content
					],
					(err, result) => {
					if(err)
						reject(err)
					else
						fulfill(result)
				})
			})
			.catch( err => reject(err) )
		}
	})
}

var updateArticle = (article, user) => {
	return new Promise((fulfill, reject) => {
		var err
		if(!article.id)
			err = "Article is missing id"
		if(!article.name)
			err = (err ? err + '\n' : '' ) + "Article is missing name."
		if(!article.content)
			err = (err ? err + '\n' : '' ) + "Article is missing body"
		if(err)
			reject(err)
		else{
			authenticateUser(user)
			.then( result => {
				return getConnection()
			})
			.catch( err => reject(err) )
			.then( con => {
				article.author = user.username
				con.query(
					`update ${contract.ArticlesEntry.TABLE_NAME} `
					+`set \`${contract.ArticlesEntry.NAME}\` = ?, `
					+`set \`${contract.ArticlesEntry.CONTENT}\` = ? `
					+`where \`${contract.ArticlesEntry.ID}\` = ? ;`,
					[
						article.name,
						article.content,
						article.id
					],
					(err, result) => {
					if(err)
						reject(err)
					else
						fulfill(result)
				})
			})
			.catch( err => reject(err) )
		}
	})
}

var insertPatient = (patient, user) => {
	return new Promise((fulfill, reject) => {
		var err
		if(!patient.name)
			err = "Patient is missing name."
		if(!patient.condition)
			err = (err ? err + '\n' : '' ) + "Patient is missing condition."
		if(err)
			reject(err)
		else{
			authenticateUser(user)
			.then( result => {
				return getConnection()
			})
			.catch( err => reject(err) )
			.then( con => {
				con.query(
					`insert into ${contract.PatientsEntry.TABLE_NAME}(`
					+`\`${contract.PatientsEntry.NAME}\`,`
					+`\`${contract.PatientsEntry.CONDITION}\`)`
					+`values (?, ?)`,
					[
						patient.name,
						patient.condition
					],
					(err, OkPacket) => {
					if(err)
						reject(err)
					else
						fulfill(OkPacket.insertId)
				})
			})
			.catch( err => reject(err) )
		}
	})
}

var updatePatient = (patient, user) => {
	return new Promise((fulfill, reject) => {
		var err
		if(!patient.id)
			err = "Patient is missing id"
		if(!patient.condition)
			err = (err ? err + '\n' : '' ) + "Patient is missing condition."
		if(err)
			reject(err)
		else{
			authenticateUser(user)
			.then( result => {
				return getConnection()
			})
			.catch( err => reject(err) )
			.then( con => {
				con.query(
					`update ${contract.PatientsEntry.TABLE_NAME} `
					+`set \`${contract.PatientsEntry.CONDITION}\` = ? `
					+`where \`${contract.PatientsEntry.ID}\` = ? ;`,
					[
						patient.condition,
						patient.id
					],
					(err, result) => {
					if(err)
						reject(err)
					else
						fulfill(result)
				})
			})
			.catch( err => reject(err) )
		}
	})
}

var getPatient = (id) => {
	return new Promise( (fulfill, reject) => {
		var query = `select * from ${contract.PatientsEntry.TABLE_NAME} where ${contract.PatientsEntry.ID} ='${id}'`;
		getConnection()
		.then( con => {
			con.query(query, (err, rows) => {
				con.release()
				if(err)
					reject(err)
				else{
					fulfill(parsers.parsePatientsFromRowData(rows)[0])
				}
			})
		})
		.catch( err => reject(err) )
	})
}

module.exports = {
	dropTables: dropTables,
	createTables: createTables,
	authenticateUser: authenticateUser,
	getUser: getUser,
	insertUserIfNotExists: insertUserIfNotExists,
	getUserByEmail: getUserByEmail,
	insertPatient: insertPatient,
	updatePatient: updatePatient,
	getPatient: getPatient
}