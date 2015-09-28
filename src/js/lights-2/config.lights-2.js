import angular from 'angular';

const app = angular.module('lights');

app.directive('lights2Phaser', require('./game/directive.lights-2-phaser'));

app.config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state('app.lights-2', {
        url: '/lights-2'
        , views: {
            'main@': {
                template: `<lights-2-phaser></lights-2-phaser>`//require('./lights-1.html')
            }
        }
    });
}]);

app.run([() => {
}]);