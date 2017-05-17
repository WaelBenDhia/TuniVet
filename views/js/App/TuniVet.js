"use strict";

var app = angular.module('tunivetApp', ['ngAnimate', 'ngSanitize', 'ngRoute', 'ngCookies', 'ngFileUpload', 'ngMap']);

var bands = [];

app.
config(function ($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'templates/landing.html',
			controller: 'landingController',
			resolve: {
				info: LandingInfoService => {
					return LandingInfoService.get();
				}
			}
		})
		.when('/login', {
			templateUrl: 'templates/login.html',
			controller: 'loginController'
		})
		.when('/patients', {
			templateUrl: 'templates/patients.html',
			controller: 'patientsController',
			resolve: {
				patients: PatientsService => {
					return PatientsService.get({
						name: "",
						page: 0,
						items: 4
					});
				}
			}
		})
		.when('/profile', {
			templateUrl: 'templates/profile.html',
			controller: 'profileController'
		})
		.when('/articles', {
			templateUrl: 'templates/articles.html',
			controller: 'articlesController'
		});
}).
controller('articlesController', function () {
	//TODO
});