const path = require('path')
const DB = require('../app/tunivetDB.js')

var isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

module.exports = (server, passport) => {
	server.get('/', (req, res) => res.sendFile(path.join(__dirname, '../views/Home.html')) )

	server.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../views/Login.html')))

	server.get('/logout', (req, res) => {
		req.logout()
		res.redirect('/')
	})

	server.get('/signup', (req, res) => res.sendFile(path.join(__dirname, '../views/SignUp.html')))

	server.post('/signup', (req, res) => {
		DB.insertUserIfNotExists({
			username: req.body.username,
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			password: req.body.password
		})
		.then( user => {
			res.redirect('/')
		})
		.catch( err => res.send(err) )
	})

	server.post('/login', passport.authenticate('local', {
		successRedirect : '/profile',
		failureRedirect : '/'
    }))

	server.get('/profile', isLoggedIn, (req, res) => res.send(req.user))

	server.get('/patient/:id', (req, res) => {
		DB.getPatient(req.params.id)
		.then( patient => res.send(patient))
		.catch( err => res.send(err))
	})
}