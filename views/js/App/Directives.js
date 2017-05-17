"use strict";

angular.module('tunivetApp')
    .directive('loading', function ($animate, $http) {
        return {
            restrict: 'A',
            link: (scope, elm) => {
                scope.isLoading = () => {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, v => {
                    if (v)
                        elm.show();
                    else
                        elm.hide();
                });
            }
        };
    })
    .directive('content', function ($animate, $http) {
        return {
            restrict: 'A',
            link: (scope, elm) => {
                scope.isLoading = () => {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, v => {
                    if (v)
                        elm.hide();
                    else
                        elm.show();
                });
            }
        };
    });