const crypto = require('crypto')

var LEN = 255
var SALT_LEN = 64
var ITERATIONS = 10000
var DIGEST = 'sha256'

var hashPassword = (password, salt) => {
	var len = LEN / 2
	return new Promise( (fulfill, reject) => {
		if( salt ){
			crypto.pbkdf2(password, salt, ITERATIONS, len, DIGEST, (err, derivedKey) => {
				if(err)
					reject(err)
				else
					fulfill({password:derivedKey.toString('hex'), salt: salt})
			})
		}else{
			console.log('1 arg')
			crypto.randomBytes(SALT_LEN / 2, (err, salt) => {
				if(err)
					reject(err)
				else{
					salt = salt.toString('hex')
					crypto.pbkdf2(password, salt, ITERATIONS, len, DIGEST, (err, derivedKey) => {
						if(err)
							reject(err)
						else
							fulfill({password:derivedKey.toString('hex'), salt: salt})
					})
				}
			})
		}
	})
}

module.exports = {
	hash: hashPassword
}