let Mixin = require('./mixin');

class MixinControllableArrows extends Mixin {
    create() {
        this.speed = 3;
    }

    static get map() {
        return [
            {key: Phaser.Keyboard.UP, arr: [0, -1]}
            , {key: Phaser.Keyboard.RIGHT, arr: [1, 0]}
            , {key: Phaser.Keyboard.DOWN, arr: [0, 1]}
            , {key: Phaser.Keyboard.LEFT, arr: [-1, 0]}
        ]
    }

    update() {
        this.constructor.map.forEach((item) => {
            if (this.game.input.keyboard.isDown(item.key)) {
                this.object.x += this.speed * item.arr[0];
                this.object.y += this.speed * item.arr[1];
            }
        })
    }
}

export default MixinControllableArrows;