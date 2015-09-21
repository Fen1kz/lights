import angular from 'angular';
import 'angular-material';
import 'angular-ui-router';
import 'js-data';
import 'js-data-angular';
import 'angular-bluebird-promises';

const APP_NAME = 'lights';
const app = angular.module(APP_NAME, [
    'ui.router'
    , 'ngMaterial'
    , 'js-data'
    , 'mwl.bluebird'
]);

app.config(['$urlRouterProvider', '$stateProvider', ($urlRouterProvider, $stateProvider) => {
    $stateProvider.state('root', {
        url: '/'
        , abstract: true
    });

    $stateProvider.state('chefs.list', {
        url: '/home'
        , views: {
            'main@': {
                template: 'home'
            }
        }
    });

    $urlRouterProvider.otherwise('/');
}]);