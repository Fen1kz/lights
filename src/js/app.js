import angular from 'angular';
import 'angular-material';
import 'angular-ui-router';
import 'js-data';
import 'js-data-angular';
import 'angular-bluebird-promises';

global.Phaser = require('Phaser');

const APP_NAME = 'lights';
const app = angular.module(APP_NAME, [
    'ui.router'
    , 'ngMaterial'
    , 'js-data'
    , 'mwl.bluebird'
]);

app.config(['$urlRouterProvider', '$stateProvider', ($urlRouterProvider, $stateProvider) => {
    $stateProvider.state('app', {
        url: ''
        , abstract: true
    });

    $urlRouterProvider.otherwise('/lights-1');
}]);

require('./home/config.home');
require('./lights-1/config.lights-1');