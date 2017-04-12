"use strict";

const path = require('path');
const DB = require('../app/tunivetDB');

var rootHandler = (req, res) => res.sendFile(path.join(__dirname, '../views/index.html'));

var logoutHandler = (req, res) => {
    req.logout();
    res.redirect('/');
};

var cssFilesHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/css/${req.params.file}`));

var fontFilesHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/css/fonts/${req.params.file}`));

var javascriptFilesHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/js/${req.params.file}`));

var angularFilesHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/js/App/${req.params.file}`));

var controllersFileHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/js/App/Controllers/${req.params.file}`));

var templatesFileHandler = (req, res) => res.sendFile(path.join(__dirname, `../views/${req.params.file}`));

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
}

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
    .catch(err => res.status(400).send(err));

var searchPatientsHandler = (req, res) =>
    DB.searchPatients(req.query.name, req.query.page || 0, req.query.items || 10)
    .then(patients => res.send(patients))
    .catch(err => {
        console.log(err);
        res.status(500).send(err);
    });

var updatePatientHandler = (req, res) =>
    DB.updatePatient({
        name: req.body.name,
        condition: req.body.condition,
        exitDate: req.body.exitDate,
        id: req.params.id,
        tarif: req.body.tarif
    }, req.user)
    .then(insertId => res.status(200).send("UPDATE SUCCESS"))
    .catch(err => res.status(400).send(err));

var deletePatientHandler = (req, res) =>
    DB.deletePatient(req.params.id, req.user)
    .then(insertId => res.status(200).send("DELETE SUCCESS"))
    .catch(err => res.status(400).send(err));

var getSinglePatientHandler = (req, res) =>
    DB.getPatient(req.params.id)
    .then(patient => res.send(patient))
    .catch(err => res.status(404).send(err));


var imageHandler = (req, res) =>
    DB.getImage(req.params.id)
    .then(image => res.send(image.imageData))
    .catch(err => res.send(err));

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

    createArticleHandler: createArticleHandler,
    getArticleHandler: getArticleHandler,

    searchPatientsHandler: searchPatientsHandler,
    createPatientHandler: createPatientHandler,
    updatePatientHandler: updatePatientHandler,
    deletePatientHandler: deletePatientHandler,
    getSinglePatientHandler: getSinglePatientHandler,

    loginHandler: loginHandler,

    imageHandler: imageHandler,

    lostHandler: lostHandler
};