/*jshint esversion: 6 */

var app = angular.module('tunivetApp', ['ngAnimate', 'ngSanitize', 'ngRoute', 'ngCookies']);

var bands = [];

app.
config(function ($routeProvider) {
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
}).
controller('articlesController', function ($scope) {});