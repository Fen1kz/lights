service.$inject = [];

let Start = require('./game/states/state.start');
let Lights2 = require('./game/states/state.lights-2');

function service() {
    return {
        init: ($scope, game) => {
            this.$scope = $scope;
            this.game = game;
            $scope.$on('$destroy', () => {
                this.$scope = null;
                this.game = null;
            });

            game.events = {
                'light.add': new Phaser.Signal()
                , 'light.remove': new Phaser.Signal()
                , 'light.rays': new Phaser.Signal()
                , 'box.add': new Phaser.Signal()
                , 'box.remove': new Phaser.Signal()
            };

            game.arrays = {};

            game.state.add('Lights2', Lights2);

            game.state.start('Lights2');
        }
        , event: (name, ...data) => {
            if (this.game.events[name]) {
                this.game.events[name].dispatch(...data)
            } else {
                console.warn(`(${name}) event is not registered`);
            }
        }
    }
}

export default service;