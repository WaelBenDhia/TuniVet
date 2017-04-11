angular.module('tunivetApp').
controller('tunivetController', function ($scope, $location, $rootScope, AuthService, Session, AUTH_EVENTS) {
    $scope.isLoggedIn = Session.getUser() !== null;

    AuthService.getUserStatus();

    $scope.$on(AUTH_EVENTS.loginSuccess, function () {
        $scope.isLoggedIn = Session.getUser() !== null;
    });

    $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
        $scope.isLoggedIn = Session.getUser() !== null;
    });

    $scope.logout = () => {
        AuthService.logout()
            .then(() => {
                $location.path('/');
            })
            .catch(err => {});
    };
});