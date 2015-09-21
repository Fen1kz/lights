let Mixin = require('./mixin');

class MixinSpam extends Mixin {
    create() {
        console.log('created');
    }

    update() {
        console.log('spam!')
    }
}

export default MixinSpam;