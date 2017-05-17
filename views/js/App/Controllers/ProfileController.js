"use strict";

angular.module('tunivetApp').
controller('profileController', function ($scope) {
    $scope.user = {
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    };
});