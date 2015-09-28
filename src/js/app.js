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

app.service('GameService', require('./service.game.js'));

app.config(['$urlRouterProvider', '$stateProvider', ($urlRouterProvider, $stateProvider) => {
    $stateProvider.state('app', {
        url: ''
        , abstract: true
        , views: {
            'toolbar@': {
                template: `
<md-button ui-sref="app.lights-1">lights-1</md-button>
<md-button ui-sref="app.lights-2">lights-2</a>
`
            }
        }
    });

    $urlRouterProvider.otherwise('/home');
}]);

require('./home/config.home');
require('./lights-1/config.lights-1');
require('./lights-2/config.lights-2');