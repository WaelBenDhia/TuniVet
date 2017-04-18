"use strict";

angular.module('tunivetApp').
controller('landingController', function ($scope, Session, BackgroundImageService, LandingInfoService, AUTH_EVENTS) {
    $scope.showImageForm = false;
    $scope.showInfoForm = false;
    $scope.image = {
        id: -1,
        imageData: null
    };
    $scope.currentInfo = {
        id: -1,
        title: null,
        body: null
    };

    $scope.closeImageForm = () => {
        $scope.showImageForm = false;
        $scope.image.id = -1;
    };

    $scope.displayImageForm = index => {
        $scope.showImageForm = true;
        $scope.image.id = index;
    };

    $scope.closeInfoForm = () => {
        $scope.showInfoForm = false;
        $scope.currentInfo.id = -1;
        $scope.currentInfo.title = null;
        $scope.currentInfo.body = null;
    };

    $scope.displayInfoForm = index => {
        $scope.showInfoForm = true;
        $scope.currentInfo.id = $scope.info[index].id;
        $scope.currentInfo.title = $scope.info[index].title;
        $scope.currentInfo.body = $scope.info[index].body;
    };

    $scope.isLoggedIn = Session.getUser() !== null;

    $scope.$on(AUTH_EVENTS.loginSuccess, function () {
        $scope.isLoggedIn = Session.getUser() !== null;
    });

    $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
        $scope.isLoggedIn = Session.getUser() !== null;
    });

    $scope.sendImage = () =>
        BackgroundImageService
        .update($scope.image)
        .then(sucess => window.location.reload(true))
        .catch(err => console.log(err));

    $scope.sendInfo = () => {
        console.log("Sending: ");
        console.log($scope.currentInfo);
        LandingInfoService.update($scope.currentInfo)
            .then(suc => {
                reloadInfo();
                console.log(suc);
                $scope.closeInfoForm();
            })
            .catch(err => console.log(err));
    };

    var reloadInfo = () => LandingInfoService.get()
        .then(info => $scope.info = info);
    reloadInfo();
});