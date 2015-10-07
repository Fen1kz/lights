import angular from 'angular';

const app = angular.module('lights');

app.directive('lights3Phaser', require('./game/directive.lights-3-phaser'));

app.config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state('app.lights-3', {
        url: '/lights-3'
        , views: {
            'main@': {
                template: `<lights-3-phaser></lights-3-phaser>`//require('./lights-1.html')
            }
        }
    });
}]);

app.run([() => {
}]);