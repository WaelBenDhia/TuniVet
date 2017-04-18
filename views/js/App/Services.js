"use strict";

angular.module('tunivetApp')
    .factory('patientsService', function ($http) {
        var patientsService = {};

        patientsService.get = (searchParams) => {
            return new Promise((fulfill, reject) =>
                $http.get('/patient', {
                    params: searchParams
                })
                .then(res => fulfill(res.data))
                .catch(e => reject(e))
            );
        };

        patientsService.getOne = (id) => {
            return new Promise((fulfill, reject) =>
                $http.get('/patient/' + id)
                .then(res => fulfill(res.data))
                .catch(e => reject(e))
            );
        };

        patientsService.update = (patient) => {
            return new Promise((fulfill, reject) =>
                $http
                .put('/patient/' + patient.id, patient)
                .then(res => fulfill(res.data))
                .catch(e => reject(e))
            );
        };

        patientsService.add = (patient) => {
            return new Promise((fulfill, reject) =>
                $http
                .post('/patient', patient)
                .then(res => fulfill(res.data))
                .catch(e => reject(e))
            );
        };

        patientsService.delete = (patient) => {
            return new Promise((fulfill, reject) =>
                $http
                .delete('/patient/' + patient.id)
                .then(res => fulfill(res.data))
                .catch(e => reject(e))
            );
        };

        return patientsService;
    })
    .factory('LandingInfoService', function ($http) {
        var landingInfoService = {};

        landingInfoService.get = (searchParams) => {
            return new Promise((fulfill, reject) =>
                $http.get('/info')
                .then(res => fulfill(res.data))
                .catch(e => reject(e))
            );
        };

        landingInfoService.update = (info) => {
            return new Promise((fulfill, reject) =>
                $http
                .put('/info/' + info.id, info)
                .then(res => fulfill(res.data))
                .catch(e => reject(e))
            );
        };

        return landingInfoService;
    })
    .factory('AuthService', ($http, Session) => {
        var authService = {};

        authService.login = user => {
            return $http
                .post('/login', user)
                .then(res => Session.create(res.data));
        };

        authService.logout = () => {
            return new Promise(function (fulfill, reject) {
                $http.get('logout')
                    .then(success => {
                        Session.destroy();
                        fulfill();
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        };

        authService.register = user => {
            return new Promise((fulfill, reject) => {
                $http.post('/signup', user)
                    .then(response => fulfill())
                    .catch(err => reject());
            });
        };

        authService.getUserStatus = () => {
            $http.get('/profile')
                .then(res => Session.create(res.data))
                .catch(e => Session.destroy());
        };
        return authService;
    })
    .factory('BackgroundImageService', (Upload) => {
        var bgService = {};

        bgService.update = image => {
            return new Promise((fulfill, reject) =>
                Upload.upload({
                    url: '/image/' + image.id,
                    file: image.imageData,
                    method: 'PUT'
                })
                .then(res => fulfill(res.data))
                .catch(e => reject(e)));
        };

        return bgService;
    })
    .service('Session', function ($rootScope, AUTH_EVENTS) {
        var sessionUser = null;

        this.getUser = () => {
            return sessionUser;
        };

        this.create = user => {
            sessionUser = user;
            if (sessionUser)
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        };

        this.destroy = () => {
            sessionUser = null;
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        };
    })
    .constant('AUTH_EVENTS', {
        loginSuccess: "auth-login-success",
        loginFailed: "auth-login-failed",
        logoutSuccess: "auth-logout-success",
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    })
    .directive('imageUpload', BackgroundImageService => {
        return {
            restrict: 'A',
            scope: true,
            link: (scope, element, attr) => {
                element.bind('change', () => {
                    var formData = new FormData();
                    formData.append('file', element[0].files[0]);
                    BackgroundImageService(formData, function (callback) {
                        console.log(callback);
                    });
                });
            }
        };
    });