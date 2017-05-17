"use strict";

angular.module('tunivetApp').
controller('loginController', function ($scope, $location, $timeout, AuthService) {
    function showMessage(message, success) {
        $scope.dataLoading = success ? true : false;
        $scope.message = message;
        $scope.showMessage = true;
        $timeout(function () {
            $scope.showMessage = false;
            $scope.dataLoading = false;
            if (success) {
                $location.path('/');
            }
        }, success ? 0 : 2000);
    }

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
});