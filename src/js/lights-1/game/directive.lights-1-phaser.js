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
    return ['GameService', function (GameService) {
        this.GameService = GameService;
    }];
}

function link(scope, element, attr, ctrl) {
    let GameService = ctrl.GameService;
    let game = new Phaser.Game(600, 300, Phaser.AUTO, document.getElementById('canvas'));


    let Start = require('./states/state.start.js');
    let Lights1 = require('./states/state.lights-1.js');

    game.events = {
        'light.add': new Phaser.Signal()
        , 'light.remove': new Phaser.Signal()
        , 'light.rays': new Phaser.Signal()
        , 'box.add': new Phaser.Signal()
        , 'box.remove': new Phaser.Signal()
    };

    ctrl.light = {
        add: () => GameService.event('light.add')
        , remove: () => GameService.event('light.remove')
        , rays: () => GameService.event('light.rays')
    };
    ctrl.box = {
        add: () => GameService.event('box.add')
        , remove: () => GameService.event('box.remove')
    };

    GameService.init(scope, game);

    game.state.add('Lights1', Lights1);

    game.state.start('Lights1');

    console.log(game);
}