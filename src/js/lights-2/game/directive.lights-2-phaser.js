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

    game.events = {};
    ['slider.change', 'sun', 'shadow']
        .forEach((s) => game.events[s] = new Phaser.Signal());

    ctrl.sun = () => GameService.event('sun');
    ctrl.shadow = () => GameService.event('shadow');

    scope.$watch(() => ctrl.slider, () => {
        GameService.event('slider.change', ctrl.slider);
    });

    GameService.init(scope, game);

    game.state.add('Lights2', Lights2);

    game.state.start('Lights2');

    console.log(game);
}