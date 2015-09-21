class Sprite extends Phaser.Sprite {
    constructor(...args) {
        super(...args);
        this.game.add.existing(this);
        this.anchor.setTo(.5, .5);

        this.mixins = [];
    }

    addMixin(mixinClass) {
        let mixin = new mixinClass(this);
        mixin.create();
        this.mixins.push(mixin);
    }

    update() {
        this.mixins.filter(mixin => mixin.update).forEach(mixin => mixin.update());
    }
}

export default Sprite;