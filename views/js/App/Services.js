angular.module('tunivetApp').
factory('patientsService', function ($http) {
    var patientsService = {};

    patientsService.get = (searchParams) => {
        return new Promise((resolve, reject) =>
            $http.get('/patients', {
                params: searchParams
            })
            .then(res => resolve(res.data))
            .catch(e => reject(e))
        );
    };

    patientsService.getOne = (id) => {
        return new Promise((resolve, reject) =>
            $http.get('/patient/' + id)
            .then(res => resolve(res.data))
            .catch(e => reject(e))
        );
    };

    patientsService.update = (patient) => {
        return new Promise((resolve, reject) =>
            $http
            .put('/patient/' + patient.id, patient)
            .then(res => resolve(res.data))
            .catch(e => reject(e))
        );
    };

    patientsService.add = (patient) => {
        return new Promise((resolve, reject) =>
            $http
            .post('/patient', patient)
            .then(res => resolve(res.data))
            .catch(e => reject(e))
        );
    };

    patientsService.delete = (patient) => {
        return new Promise((resolve, reject) =>
            $http
            .delete('/patient/' + patient.id)
            .then(res => resolve(res.data))
            .catch(e => reject(e))
        );
    };

    return patientsService;
}).factory('AuthService', ($http, Session) => {
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
}).service('Session', function ($rootScope, AUTH_EVENTS) {
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
}).constant('AUTH_EVENTS', {
    loginSuccess: "auth-login-success",
    loginFailed: "auth-login-failed",
    logoutSuccess: "auth-logout-success",
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
});