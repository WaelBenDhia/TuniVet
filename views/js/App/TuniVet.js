"use strict";

var app = angular.module('tunivetApp', ['ngAnimate', 'ngSanitize', 'ngRoute', 'ngCookies', 'ngFileUpload']);

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
}).
controller('articlesController', function ($scope) {});