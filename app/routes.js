const path = require('path')
const DB = require('../app/tunivetDB.js')
const handelbars = require('express-handlebars')

var isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated())
		return next();
	res.redirect('/login');
}

module.exports = (server, passport) => {
	server.get('/', (req, res) => res.sendFile(path.join(__dirname, '../views/index.html')) )

	server.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../views/Login.html')))

	server.get('/article/insert', isLoggedIn, (req, res) => res.sendFile(path.join(__dirname, '../views/articleinsert.html')))

	server.get('/patient/insert', isLoggedIn, (req, res) => res.sendFile(path.join(__dirname, '../views/patientinsert.html')))

	server.get('/logout', (req, res) => {
		req.logout()
		res.redirect('/')
	})

	server.get('/css/:file', (req, res) => res.sendFile(path.join(__dirname, `../views/css/${req.params.file}`)))

	server.get('/js/:file', (req, res) => res.sendFile(path.join(__dirname, `../views/js/${req.params.file}`)))

	server.get('/templates/:file', (req, res) => res.sendFile(path.join(__dirname, `../views/${req.params.file}`)))

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

	server.get('/userstatus', (req, res) => {
		if (!req.isAuthenticated()) 
			res.status(200).json({ status: false })
		else
			res.status(200).json({ status: true });
	})

	server.post('/article/insert', isLoggedIn, (req, res) => {
		DB.insertArticle({
			name: req.body.name,
			content: req.body.content
		}, req.user)
		.then( insertId => res.redirect('/article/'+insertId))
		.catch( err => res.send(err) )
	})

	server.post('/patient/insert', isLoggedIn, (req, res) => {
		DB.insertPatient({
			name: req.body.name,
			condition: req.body.condition
		}, req.user)
		.then( insertId => res.redirect('/patient/'+insertId))
		.catch( err => res.send(err) )
	})

	server.post('/login', (req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if(err)
				return next(err)
			if(!user)
				return res.status(401).json({err: info})
			req.logIn(user, err => {
				if(err)
					return res.status(500).json({ err: 'Login echoue.'})
				res.status(200).json({ status: 'Login reussi'})
			})
		})(req, res, next)
    })

	server.get('/profile', isLoggedIn, (req, res) => res.send(req.user))

	server.get('/article/:id', (req, res) => {
		DB.getArticle(req.params.id)
		.then( patient => res.send(patient))
		.catch( err => res.send(err))
	})

	server.get('/patient/:id', (req, res) => {
		DB.getPatient(req.params.id)
		.then( patient => res.send(patient))
		.catch( err => res.send(err))
	})

	server.get('/image/:id', (req, res) => {
		DB.getImage(req.params.id)
		.then( image => res.send(image.imageData))
		.catch( err => res.send(err))
	})

	server.get('*', (req, res) => {
		res.send("Vous avez l'air perdu", 404)
	})
}