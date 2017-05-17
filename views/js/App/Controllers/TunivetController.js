"use strict";

angular.module('tunivetApp').
controller('tunivetController', function ($scope, $location, PatientsService, AuthService, Session, AUTH_EVENTS) {
    $scope.isLoggedIn = Session.getUser() !== null;
    $scope.showPatient = false;
    $scope.year = new Date().getFullYear();
    $scope.patient = {
        id: 0,
        name: "",
        condition: ""
    };

    $scope.closePatient = () => {
        $scope.showPatient = false;
    };

    $scope.getPatient = () => {
        PatientsService.getOne($scope.patient.id)
            .then(suc => {
                $scope.patient = suc;
                $scope.showPatient = true;
                $scope.$apply();
            })
            .catch(err => {
                $scope.patient.name = err.data;
                $scope.showPatient = true;
                $scope.$apply();
            });

    };

    AuthService.getUserStatus();

    $scope.$on(AUTH_EVENTS.loginSuccess, () => {
        $scope.isLoggedIn = Session.getUser() !== null;
    });

    $scope.$on(AUTH_EVENTS.logoutSuccess, () => {
        $scope.isLoggedIn = Session.getUser() !== null;
    });

    $scope.logout = () => {
        AuthService.logout()
            .then(() => $location.path('/'))
            .catch(console.log);
    };
});