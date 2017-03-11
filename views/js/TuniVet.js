var app = angular.module('tunivetApp', ['ngAnimate', 'ngRoute', 'ngCookies']);

var bands = [];

app
.config(function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl:'templates/landing.html',
		controller: 'landingController'
	})
	.when('/login', {
		templateUrl:'templates/login.html',
		controller: 'loginController'
	})
	.when('/patient/:id', {
		templateUrl:'templates/patient.html',
		controller: 'patientController'
	})
	.when('/articles', {
		templateUrl:'templates/articles.html',
		controller: 'articlesController'
	})
	.when('/albums/:rating', {
		templateUrl:'templates/albumSearchView.html',
		controller: 'albumSearchController'
	});
})
.controller('tunivetController', function($scope, $location, $rootScope, AuthService){
	$scope.isLoggedIn = AuthService.getUserStatus() == 'true'
	$scope.$on('loginBroadcast', function() {
		$scope.isLoggedIn = AuthService.getUserStatus()
	})


	$scope.logout = () => {
		AuthService.logout()
		.then(() => {
			AuthService.broadcastLogin()
			$location.path('/')
		})
		.catch( err => {
			console.log(err)
		})
	}
})
.controller('landingController', function($scope){
	$scope.selection = 0;
	$scope.select = selection => {
		switch(selection){
			case 0 : console.log("Introduction"); break;
			case 1 : console.log("Contact"); break;
			case 2 : console.log("Tarifs"); break;
			case 3 : console.log("Suivi"); break;
			case 4 : console.log("Articles"); break;
		}
		$scope.selection = selection;
	}
})
.controller('loginController', function($scope, $location, $timeout, AuthService){
	$scope.dataLoading = false;
	$scope.showMessage = false;

	$scope.login = user => {
		$scope.dataLoading = true;
		AuthService.login(user)
		.then(
			function(success){
				AuthService.broadcastLogin()
				showMessage(success, true);
			},
			function(err){
				showMessage(err);
			})
	}

	var showMessage = function(message, success){
		$scope.dataLoading = success ? true : false;
		$scope.message = message;
		$scope.showMessage = true;
		$timeout(function(){
			$scope.showMessage = false;
			$scope.dataLoading = false;
			if(success){
				$location.path('/');
			}
		}, success ? 1000 : 2000);
	}
})
.controller('articlesController', function($scope){
})
.factory('AuthService', ($rootScope, $http) => {
	var user = null;

	return ({
		isLoggedIn: isLoggedIn,
		getUserStatus: getUserStatus,
		login: login,
		logout: logout,
		register: register,
		broadcastLogin: broadcastLogin
	});

	function isLoggedIn(){
		return user ? true : false;
	}

	function getUserStatus(){
		console.log("getting status")
		return $http.get('/userStatus')
		.then( res => {
			user = res.data.status
		})
		.catch( err => {
			user = false;
		});
	}

	function login(user){
		return new Promise(function(fulfill, reject){
			$http.post('/login', user)
			.then( success => {
				fulfill(success.data.status);
			})
			.catch( err => {
				reject(err.data.err.message);
			})
		});
	}

	function logout(){
		return new Promise(function(fulfill, reject){
			$http.get('logout')
			.then( success =>{
				user = false;
				fulfill();
			})
			.catch( err => {
				user = false;
				reject(err);
			});
		});
	}

	function register(user){
		return new Promise( (fulfill,reject) => {
			$http.post('/signup', user)
			.then( response => {
				fulfill();
			})
			.catch( err => {
				reject();
			});
		});
	}

	function broadcastLogin(){
		console.log("Broadcasting")
		$rootScope.$broadcast('loginBroadcast');
	}
});