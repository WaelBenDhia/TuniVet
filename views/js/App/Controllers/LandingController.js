angular.module('tunivetApp').
controller('landingController', function ($scope) {
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
});