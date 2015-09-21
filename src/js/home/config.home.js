import angular from 'angular';

const app = angular.module('lights');

app.config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state('app.home', {
        url: '/home'
        , views: {
            'main@': {
                template: '<div>Sup im home!</div>'
            }
        }
    });
}]);
