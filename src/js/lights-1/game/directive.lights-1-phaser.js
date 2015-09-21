export default directiveFactory();

function directiveFactory() {
    return [function () {
        return {
            restrict: 'E'
            , scope: {}
            , template: require('./directive.lights-1-phaser.html')
            , link: link
            , controller: controllerFactory()
            , controllerAs: 'phaserCtrl'
            , bindToController: true
        }

    }]
}

function controllerFactory() {
    return ['$document', function ($document) {
    }];
}

let Start = require('./states/state.start');
let Lights2 = require('./states/state.lights-2');

function link(scope, element, attr) {
    console.log(Phaser);
    let game = new Phaser.Game(800, 600, Phaser.AUTO, document.getElementById('canvas'));

    //game.state.add('Start', Start);
    game.state.add('Lights2', Lights2);

    game.state.start('Lights2');
}