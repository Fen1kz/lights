export default directiveFactory();

function directiveFactory() {
    return [function () {
        return {
            restrict: 'E'
            , scope: {}
            , template: require('./directive.lights-2-phaser.html')
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
    let game = new Phaser.Game(600, 300, Phaser.WEBGL, document.getElementById('canvas'));
    window.game = game;

    let Lights2 = require('./states/state.lights-2.js');

    game.events = {
        'light.add': new Phaser.Signal()
        , 'light.remove': new Phaser.Signal()
        , 'light.rays': new Phaser.Signal()
        , 'box.add': new Phaser.Signal()
        , 'box.remove': new Phaser.Signal()
        , 'slider.change': new Phaser.Signal()
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

    scope.$watch(() => ctrl.slider, () => {
        GameService.event('slider.change', ctrl.slider);
    });

    GameService.init(scope, game);

    game.state.add('Lights2', Lights2);

    game.state.start('Lights2');

    console.log(game);
}