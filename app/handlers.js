"use strict";

const path = require('path');
const fs = require('fs');
const busboy = require('connect-busboy');
const DB = require('../app/tunivetDB');

var rootHandler = (req, res) => res.sendFile(path.join(__dirname, '../views/templates/index.html'));

var logoutHandler = (req, res) => {
    req.logout();
    res.redirect('/');
};

var cssFilesHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/css/${req.params.file}`));

var fontFilesHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/css/fonts/${req.params.file}`));

var javascriptFilesHandler = (req, res) =>
    res.sendFile(
        path.join(
            __dirname,
            req.params.file.slice(0, -7) == 'ng-map' ?
            `../views/js/bower_components/ngmap/build/scripts/ng-map.min.js` :
            `../views/js/bower_components/${req.params.file.slice(0, -7)}/${req.params.file}`));

var angularFilesHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/js/App/${req.params.file}`));

var controllersFileHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/js/App/Controllers/${req.params.file}`));

var templatesFileHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/templates/${req.params.file}`));

var createUserHandler = (req, res) =>
    DB.insertUserIfNotExists({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })
    .then(user => res.status(201).send(user))
    .catch(err => res.status(400).send(err));

var getLoggedInUserHandler = (req, res) => {
    var user = req.user;
    delete user.password;
    delete user.salt;
    res.send(user);
};

var updateLoggedInUserHandler = (req, res) => {
    DB.updateUser({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }, req.user)
        .then(user => res.status(201).send(user))
        .catch(err => res.status(400).send(err));
};

var createArticleHandler = (req, res) =>
    DB.insertArticle({
        name: req.body.name,
        content: req.body.content
    }, req.user)
    .then(insertId => res.status(201).send({
        id: insertId
    }))
    .catch(err => res.status(400).send(err));

var getArticleHandler = (req, res) =>
    DB.getArticle(req.params.id)
    .then(article => res.send(article))
    .catch(err => res.send(err));

var loginHandler = (passport) => {
    return (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err)
                return next(err);
            if (!user)
                return res.status(401).json({
                    err: info
                });
            req.logIn(user, err => {
                if (err)
                    return res.status(500).json({
                        err: 'Login echoue.'
                    });
                delete user.password;
                delete user.salt;
                res.status(200).json(user);
            });
        })(req, res, next);
    };
};


var createPatientHandler = (req, res) =>
    DB.insertPatient(req.body, req.user)
    .then(insertId => res.status(200).send({
        id: insertId
    }))
    .catch(err => {
        console.log(err);
        res.status(400).send(err);
    });

var searchPatientsHandler = (req, res) =>
    DB.searchPatients(req.query.name, req.query.page || 0, req.query.items || 10)
    .then(patients => res.send(patients))
    .catch(err => res.status(500).send(err));

var updatePatientHandler = (req, res) =>
    DB.updatePatient({
        name: req.body.name,
        condition: req.body.condition,
        exitDate: req.body.exitDate,
        id: req.params.id,
        tarif: req.body.tarif
    }, req.user)
    .then(() => res.status(200).send("UPDATE SUCCESS"))
    .catch(err => res.status(400).send(err));

var deletePatientHandler = (req, res) =>
    DB.deletePatient(req.params.id, req.user)
    .then(() => res.status(200).send("DELETE SUCCESS"))
    .catch(err => res.status(400).send(err));

var getSinglePatientHandler = (req, res) =>
    DB.getPatient(req.params.id)
    .then(patient => res.send(patient))
    .catch(err => res.status(404).send(err));


var imageGetHandler = (req, res) => res.sendFile(path.join(__dirname, '/../upload/', req.params.id));

var imageUpdateHandler = (req, res) => {
    var fstream = null;
    req.pipe(req.busboy);
    req.busboy
        .on('file', (fieldname, file) => {
            var filePath = path.join(__dirname, '/../upload/', req.params.id);
            fstream = fs.createWriteStream(filePath);
            console.log(filePath);
            file.pipe(fstream);
            var error = null;
            fstream.on('error', err => error = err);
            fstream.on('close', () => {
                if (error)
                    res.status(500).send(error);
                else
                    res.status(200).send('upload success');
            });
        });
};

var getInfoHandler = (req, res) =>
    DB.getInfo()
    .then(info => res.send(info))
    .catch(err => res.status(500).send(err));

var updateInfoHandler = (req, res) =>
    DB.updateInfo({
        id: req.body.id,
        title: req.body.title,
        body: req.body.body
    }, req.user)
    .then(() => res.status(200).send("UPDATE SUCCESS"))
    .catch(err => res.status(400).send(err));

var lostHandler = (req, res) => res.status(404).send("Vous avez l'air perdu");

module.exports = {
    rootHandler: rootHandler,
    logoutHandler: logoutHandler,
    cssFilesHandler: cssFilesHandler,
    fontFilesHandler: fontFilesHandler,
    javascriptFilesHandler: javascriptFilesHandler,
    angularFilesHandler: angularFilesHandler,
    controllersFileHandler: controllersFileHandler,
    templatesFileHandler: templatesFileHandler,

    createUserHandler: createUserHandler,
    getLoggedInUserHandler: getLoggedInUserHandler,
    updateLoggedInUserHandler: updateLoggedInUserHandler,

    createArticleHandler: createArticleHandler,
    getArticleHandler: getArticleHandler,

    searchPatientsHandler: searchPatientsHandler,
    createPatientHandler: createPatientHandler,
    updatePatientHandler: updatePatientHandler,
    deletePatientHandler: deletePatientHandler,
    getSinglePatientHandler: getSinglePatientHandler,

    loginHandler: loginHandler,

    imageGetHandler: imageGetHandler,
    imageUpdateHandler: imageUpdateHandler,

    getInfoHandler: getInfoHandler,
    updateInfoHandler: updateInfoHandler,

    lostHandler: lostHandler
};