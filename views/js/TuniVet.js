/*jshint esversion: 6 */

var app = angular.module('tunivetApp', ['ngAnimate', 'ngSanitize', 'ngRoute', 'ngCookies']);

var bands = [];

app
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'templates/landing.html',
				controller: 'landingController'
			})
			.when('/login', {
				templateUrl: 'templates/login.html',
				controller: 'loginController'
			})
			.when('/patients', {
				templateUrl: 'templates/patients.html',
				controller: 'patientsController'
			})
			.when('/patient/:id', {
				templateUrl: 'templates/patient.html',
				controller: 'patientController'
			})
			.when('/articles', {
				templateUrl: 'templates/articles.html',
				controller: 'articlesController'
			})
			.when('/albums/:rating', {
				templateUrl: 'templates/albumSearchView.html',
				controller: 'albumSearchController'
			});
	})
	.controller('tunivetController', function ($scope, $location, $rootScope, AuthService, Session, AUTH_EVENTS) {
		$scope.isLoggedIn = Session.getUser() !== null;

		AuthService.getUserStatus();

		$scope.$on(AUTH_EVENTS.loginSuccess, function () {
			$scope.isLoggedIn = Session.getUser() !== null;
		});

		$scope.$on(AUTH_EVENTS.logoutSuccess, function () {
			console.log("Logout success");
			$scope.isLoggedIn = Session.getUser() !== null;
		});

		$scope.logout = () => {
			AuthService.logout()
				.then(() => {
					$location.path('/');
				})
				.catch(err => {});
		};
	})
	.controller('landingController', function ($scope) {
		$scope.info = [{
			title: 'Bienvenue',
			body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
		}, {
			title: 'Horaires',
			body: "Ut enim ad minim veniam, quis nostrud exercitation<table><tr><td>Lundi - Mardi</td><td>9h a 18h</td></tr><tr><td>Samedi</td><td>9h a 14h</td></tr></table>ullamco laboris nisi ut aliquip ex ea commodo consequat."
		}, {
			title: 'Tarifs',
			body: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
		}, {
			title: 'Autre',
			body: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
		}];
	})
	.controller('loginController', function ($scope, $location, $timeout, AuthService) {
		$scope.dataLoading = false;
		$scope.showMessage = false;

		$scope.login = user => {
			$scope.dataLoading = true;
			AuthService.login(user)
				.then(success => {
					showMessage(success, true);
				})
				.catch(err => {
					showMessage(err.data.err.message);
				});
		};

		var showMessage = function (message, success) {
			$scope.dataLoading = success ? true : false;
			$scope.message = message;
			$scope.showMessage = true;
			$timeout(function () {
				$scope.showMessage = false;
				$scope.dataLoading = false;
				if (success) {
					$location.path('/');
				}
			}, success ? 1000 : 2000);
		};
	})
	.controller('articlesController', function ($scope) {})
	.controller('patientsController', function ($scope, patientsService) {
		$scope.patients = [];
		patientsService.getAll().then(res => {
			$scope.patients = res;
			console.log(res);
		});
	})
	.factory('patientsService', function ($http) {
		var patientsService = {};

		patientsService.getAll = () => {
			return new Promise((resolve, reject) => {
				$http.get('/patients').then(res => {
						resolve(res.data);
					})
					.catch(e => reject(e));
			});
		};

		return patientsService;
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
	});