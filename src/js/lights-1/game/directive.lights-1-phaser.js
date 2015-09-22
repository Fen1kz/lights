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

        this.light = {
            add: () => this.GameService.event('light.add')
            , remove: () => this.GameService.event('light.remove')
            , rays: () => this.GameService.event('light.rays')
        };
        this.box = {
            add: () => this.GameService.event('box.add')
            , remove: () => this.GameService.event('box.remove')
        };
    }];
}

function link(scope, element, attr, ctrl) {
    let GameService = ctrl.GameService;
    let game = new Phaser.Game(600, 300, Phaser.AUTO, document.getElementById('canvas'));
    console.log(game);
    GameService.init(scope, game);
}