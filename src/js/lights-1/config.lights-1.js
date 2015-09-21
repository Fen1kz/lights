import angular from 'angular';

const app = angular.module('lights');

app.directive('lights1Phaser', require('./game/directive.lights-1-phaser'))

app.config(['$stateProvider', ($stateProvider) => {
    $stateProvider.state('app.lights1', {
        url: '/lights-1'
        , views: {
            'main@': {
                template: `<lights-1-phaser></lights-1-phaser>`//require('./lights-1.html')
            }
        }
    });
}]);

app.run([() => {
}]);