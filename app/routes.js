"use strict";

const Handlers = require('./handlers');

var isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	res.sendStatus(401);
};

module.exports = (server, passport) => {
	server.get('/', Handlers.rootHandler);

	server.get('/logout', Handlers.logoutHandler);

	server.get('/css/:file', Handlers.cssFilesHandler);

	server.get('/css/fonts/:file', Handlers.fontFilesHandler);

	server.get('/js/:file', Handlers.javascriptFilesHandler);

	server.get('/js/App/:file', Handlers.angularFilesHandler);

	server.get('/js/App/Controllers/:file', Handlers.controllersFileHandler);

	server.get('/templates/:file', Handlers.templatesFileHandler);

	server.post('/createUser', isLoggedIn, Handlers.createUserHandler);

	server.post('/article/insert', isLoggedIn, Handlers.createArticleHandler);

	server.post('/login', Handlers.loginHandler(passport));

	server.get('/profile', isLoggedIn, Handlers.getLoggedInUserHandler);

	server.get('/article/:id', Handlers.getArticleHandler);

	server.get('/patient', isLoggedIn, Handlers.searchPatientsHandler);

	server.post('/patient', isLoggedIn, Handlers.createPatientHandler);

	server.put('/patient/:id', isLoggedIn, Handlers.updatePatientHandler);

	server.delete('/patient/:id', isLoggedIn, Handlers.deletePatientHandler);

	server.get('/patient/:id', Handlers.getSinglePatientHandler);

	server.get('/image/:id', Handlers.imageGetHandler);

	server.put('/image/:id', isLoggedIn, Handlers.imageUpdateHandler);

	server.get('/info', Handlers.getInfoHandler);

	server.put('/info/:id', isLoggedIn, Handlers.updateInfoHandler);

	server.get('*', Handlers.lostHandler);
};