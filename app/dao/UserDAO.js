const Contract = require('../../utils/TunivetContract.js')
const Parsers = require('../../utils/Parsers.js')
const PasswordHelper = require('../../utils/password.js')
const IsEmail = require('isemail')

var getConnection = require('../../utils/ConnectionHandler.js').getConnection

var authenticateUser = (user) =>{
	return new Promise((fulfill, reject) =>{
		var err
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
					return PasswordHelper.hash(user.password, dbUser.salt)
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
				else
					return PasswordHelper.hash(user.password)
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
					`insert into ${Contract.UsersEntry.TABLE_NAME}(`
					+`\`${Contract.UsersEntry.USERNAME}\`,`
					+`\`${Contract.UsersEntry.EMAIL}\`,`
					+`\`${Contract.UsersEntry.FIRST_NAME}\`,`
					+`\`${Contract.UsersEntry.LAST_NAME}\`,`
					+`\`${Contract.UsersEntry.PASSWORD}\`,`
					+`\`${Contract.UsersEntry.SALT}\`) `
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
						con.release
						if(err)
							reject(err)
						else
							fulfill(OkPacket)
				})
			})
		}
	})
}

var getUser = (username) => {
	return new Promise( (fulfill, reject) => {
		var query = `select * from ${Contract.UsersEntry.TABLE_NAME} where ${Contract.UsersEntry.USERNAME} ='${username}'`;
		getConnection()
		.then( con => {
			con.query(query, (err, rows) => {
				con.release()
				if(err)
					reject(err)
				else{
					fulfill(Parsers.parseUsersFromRowData(rows)[0])
				}
			})
		})
		.catch( err => reject(err) )
	})
}

var getUserByEmail = (email) => {
	return new Promise( (fulfill, reject) => {
		var query = `select * from ${Contract.UsersEntry.TABLE_NAME} where ${Contract.UsersEntry.EMAIL} ='${email}'`;
		getConnection()
		.then( con => {
			con.query(query, (err, rows) => {
				con.release()
				if(err)
					reject(err)
				else{
					fulfill(Parsers.parseUsersFromRowData(rows)[0])
				}
			})
		})
		.catch( err => reject(err) )
	})
}

module.exports = {
	authenticateUser: authenticateUser,
	insertUserIfNotExists: insertUserIfNotExists,
	getUser: getUser,
	getUserByEmail: getUserByEmail
}