const Contract = require('../../utils/TunivetContract.js')
const Parsers = require('../../utils/Parsers.js')
const PasswordHelper = require('../../utils/password.js')

var getConnection = require('../../utils/ConnectionHandler.js').getConnection

var getArticle = (id) => {
	return new Promise( (fulfill, reject) => {
		var query = `select * from ${Contract.ArticlesEntry.TABLE_NAME} where ${Contract.ArticlesEntry.ID} ='${id}'`;
		getConnection()
		.then( con => {
			con.query(query, (err, rows) => {
				con.release()
				if(err)
					reject(err)
				else{
					fulfill(Parsers.parseArticlesFromRowData(rows)[0])
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
			getConnection()
			.then( con => {
				article.author = user.username
				con.query(
					`insert into ${Contract.ArticlesEntry.TABLE_NAME}(`
					+`\`${Contract.ArticlesEntry.NAME}\`,`
					+`\`${Contract.ArticlesEntry.AUTHOR}\`,`
					+`\`${Contract.ArticlesEntry.CONTENT}\`) `
					+`values (?, ?, ?)`,
					[
						article.name,
						article.author,
						article.content
					], 
					(err, OkPacket) => {
						con.release()
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
			getConnection()
			.then( con => {
				article.author = user.username
				con.query(
					`update ${Contract.ArticlesEntry.TABLE_NAME} `
					+`set \`${Contract.ArticlesEntry.NAME}\` = ?, `
					+`set \`${Contract.ArticlesEntry.CONTENT}\` = ? `
					+`where \`${Contract.ArticlesEntry.ID}\` = ? ;`,
					[
						article.name,
						article.content,
						article.id
					],
					(err, OkPacket) => {
						con.release()
						if(err)
							reject(err)
						else
							fulfill(OkPacket)
				})
			})
			.catch( err => reject(err) )
		}
	})
}

module.exports = {
	getArticle: getArticle,
	insertArticle: insertArticle,
	updateArticle: updateArticle
}