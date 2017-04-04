const Contract = require('../utils/TunivetContract.js')
const ConnectionHandler = require('../utils/ConnectionHandler.js')

const PatientDAO = require('./dao/PatientDAO')
const UserDAO = require('./dao/UserDAO')
const ArticleDAO = require('./dao/ArticleDAO')
const BackgroundImageDAO = require('./dao/BackgroundImageDAO')

var getConnection = ConnectionHandler.getConnection

var dropTables = () => {
	var dropQuery = `drop table if exists `
		+`${Contract.BackgroundImagesEntry.TABLE_NAME}, `
		+`${Contract.ArticlesEntry.TABLE_NAME}, `
		+`${Contract.PatientsEntry.TABLE_NAME}, `
		+`${Contract.UsersEntry.TABLE_NAME};`
	return new Promise((fulfill, reject) => {
		getConnection().then((con) => {
			con.query(dropQuery, (err, rows) => {
				con.release()
				if(err)
					reject(err)
				else[]
					fulfill(rows)
			})
		})
	})
}

var createTables = () => {
	
	var createUsersQuery = `create table if not exists ${Contract.UsersEntry.TABLE_NAME}(`
		+`\`${Contract.UsersEntry.USERNAME}\` varchar(255) not null primary key,`
		+`\`${Contract.UsersEntry.FIRST_NAME}\` varchar(255),`
		+`\`${Contract.UsersEntry.LAST_NAME}\` varchar(255),`
		+`\`${Contract.UsersEntry.EMAIL}\`varchar(255) not null unique,`
		+`\`${Contract.UsersEntry.PASSWORD}\` varchar(255) not null,`
		+`\`${Contract.UsersEntry.SALT}\` varchar(255) not null);`
	
	var createPatientsQuery	= `create table if not exists ${Contract.PatientsEntry.TABLE_NAME}(`
		+`\`${Contract.PatientsEntry.ID}\` int not null auto_increment primary key,`
		+`\`${Contract.PatientsEntry.NAME}\` varchar(255) not null,`
		+`\`${Contract.PatientsEntry.ENTRY_DATE}\` timestamp default current_timestamp not null,`
		+`\`${Contract.PatientsEntry.EXIT_DATE}\` timestamp null,`
		+`\`${Contract.PatientsEntry.UPDATE_DATE}\` timestamp default current_timestamp on update current_timestamp,`
		+`\`${Contract.PatientsEntry.CONDITION}\` varchar(255) not null);`
	
	var createArticlesQuery = `create table if not exists ${Contract.ArticlesEntry.TABLE_NAME}(`
		+`\`${Contract.ArticlesEntry.ID}\` int not null auto_increment primary key,`
		+`\`${Contract.ArticlesEntry.NAME}\` varchar(255) not null,`
		+`\`${Contract.ArticlesEntry.AUTHOR}\` varchar(255) not null,`
		+`\`${Contract.ArticlesEntry.WRITE_DATE}\` timestamp default current_timestamp,`
		+`\`${Contract.ArticlesEntry.LAST_UPDATE_DATE}\` timestamp default current_timestamp on update current_timestamp,`
		+`\`${Contract.ArticlesEntry.CONTENT}\` text,`
		+"foreign key (author) references users(username));"
	
	var createBackgroundImagesQuery	= `create table if not exists ${Contract.BackgroundImagesEntry.TABLE_NAME}(`
		+`\`${Contract.BackgroundImagesEntry.ID}\` int not null auto_increment primary key,`
		+`\`${Contract.BackgroundImagesEntry.IMAGE_DATA}\` mediumblob);`

	var createLandingPageInfoQuery = `create table if not exists ${Contract.LandingPageInfoEntry.TABLE_NAME}(`
		+`\`${Contract.LandingPageInfoEntry.ID}\` int not null auto_increment primary key,`
		+`\`${Contract.LandingPageInfoEntry.TITLE}\` varchar(255),`
		+`\`${Contract.LandingPageInfoEntry.BODY}\` text);`

	var fuls = []
	return new Promise((fulfill, reject) => {
		getConnection().then((con) => {
			con.query(createUsersQuery, (err, success) => {
				if(err){
					con.release()
					reject(err + "\n" + createUsersQuery)
				}else{
					fuls.push(`${Contract.UsersEntry.TABLE_NAME} table created successfully.`)
					con.query(createPatientsQuery, (err, success) => {
						if(err){
							con.release()
							reject(err + "\n" + createPatientsQuery)
						}else{
							fuls.push(`${Contract.PatientsEntry.TABLE_NAME} table created successfully.`)
							con.query(createArticlesQuery, (err, success) => {
								if(err){
									con.release()
									reject(err + "\n" + createArticlesQuery)
								}else{
									fuls.push(`${Contract.ArticlesEntry.TABLE_NAME} table created successfully.`)
									con.query(createBackgroundImagesQuery, (err, success) => {
										if(err){
											con.release()
											reject(err + "\n" + createBackgroundImagesQuery)
										}else{
											fuls.push(`${Contract.BackgroundImagesEntry.TABLE_NAME} table created successfully.`)
											con.query(createLandingPageInfoQuery, (err, success) => {
												con.release()
												if(err)
													reject(err + "\n" + createLandingPageInfoQuery)
												else{
													fuls.push(`${Contract.LandingPageInfoEntry.TABLE_NAME} table created successfully.`)
													fulfill(fuls)
												}
											})
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

module.exports = {
	getConnection: getConnection,
	dropTables: dropTables,
	createTables: createTables,
	authenticateUser: UserDAO.authenticateUser,
	getUser: UserDAO.getUser,
	insertUserIfNotExists: UserDAO.insertUserIfNotExists,
	getUserByEmail: UserDAO.getUserByEmail,
	insertPatient: PatientDAO.insertPatient,
	updatePatient: PatientDAO.updatePatient,
	getPatient: PatientDAO.getPatient,
	insertArticle: ArticleDAO.insertArticle,
	getArticle: ArticleDAO.getArticle,
	getImage: BackgroundImageDAO.getBackgroundImage,
	getPatients: PatientDAO.getPatients
}