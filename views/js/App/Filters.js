angular.module('tunivetApp').
filter('frenchDate', ($filter) => {
    return input => {
        if (input === 'Invalid date')
            return 'Non disponible';
        else
            return $filter('date')(new Date(input), "dd/MM/yyyy");
    };
});