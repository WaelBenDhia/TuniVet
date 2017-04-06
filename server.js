const express = require('express');
const passport = require('passport');
const server = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const DB = require('./app/tunivetDB.js');

var port = process.env.PORT || 8081;
var ip = process.env.IP || '0.0.0.0';

server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(session({
    secret: 'tunivet2017',
    resave: true,
    saveUninitialized: true,
}));
server.use(passport.initialize());
server.use(passport.session());

require('./config/passport.js')(passport);

require('./app/routes.js')(server, passport);

DB.createTables()
    .then(fuls => fuls.forEach(ful => console.log(ful)))
    .catch(err => console.log(err));

server.listen(port, ip, () => console.log("Listening on " + ip + ", port " + port));