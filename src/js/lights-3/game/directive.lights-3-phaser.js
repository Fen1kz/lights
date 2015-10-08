export default directiveFactory();

function directiveFactory() {
    return [function () {
        return {
            restrict: 'E'
            , scope: {}
            , template: require('./directive.lights-3-phaser.html')
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

    let Lights3 = require('./states/state.lights-3.js');

    game.events = {};
    ['slider.change', 'sun', 'shadow'
        , 'light.add', 'light.remove', 'light.rays'
        , 'box.add', 'box.remove']
        .forEach((s) => game.events[s] = new Phaser.Signal());

    ctrl.sun = () => GameService.event('sun');
    ctrl.shadow = () => GameService.event('shadow');

    scope.$watch(() => ctrl.slider, () => {
        GameService.event('slider.change', ctrl.slider);
    });

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

    game.state.add('Lights3', Lights3);

    game.state.start('Lights3');

    console.log(game);
}