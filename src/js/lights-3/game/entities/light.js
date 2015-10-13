let Sprite = require('./sprite');

class Light extends Sprite {
    constructor(...args) {
        super(...args);

        //this.SIZE = 256;
        ////this.SHADER_SIZE = this.SIZE * 2;
        //this.SHADER_SIZE = this.SIZE;
        //
        //this.grayShader = new Phaser.Filter(this.game, null, require('../shaders/gray.frag'));
        //
        //this.shadowBlurX = new Phaser.Filter(this.game, {
        //    blur: {type: '1f', value: 0.5}
        //    , shaderResolution: { type: '2fv', value: [this.SHADER_SIZE] }
        //}, require('../shaders/blur-x.frag'));
        //
        //this.shadowBlurY = new Phaser.Filter(this.game, {
        //    blur: {type: '1f', value: 0.5}
        //    , shaderResolution: { type: '2fv', value: [this.SHADER_SIZE] }
        //}, require('../shaders/blur-y.frag'));
        //
        //this.renderTexure = new Phaser.RenderTexture(this.game, this.SIZE, this.SIZE);
        //
        ////this.renderTexure.renderRawXY(this.game.stage, 0,0);
        //
        //this.lighting = new Phaser.Image(this.game, -this.SIZE / 2, -this.SIZE / 2, this.renderTexure);
        ////this.lighting = new Phaser.Image(this.game, 0, 0, this.renderTexure);
        //
        //
        //this.addChild(this.lighting);
        //
        ////console.log('light');
        //this.bitmapData = new Phaser.BitmapData(this.game, 255, 255);
        //this.bitmapData.context.fillStyle = 'rgb(128, 128, 128)';
        //this.bitmapData.context.fillRect(0, 0, 255, 255);
        //this.bitmapData.context.fill();
        //
        //this.image = new Phaser.Image(this.game, 0, 0, this.bitmapData);
        ////this.addChild(this.image);
        ////this.image.filters = [this.shadowTexureShader];
        //
        ////this.lighting.filters = [this.shadowTexureShader];
        ////this.lighting.filters = [this.shadowTexureShader, this.shadowCastShader];
        //this.lighting.filters = [this.shadowTexureShader, this.shadowCastShader, this.shadowBlurX, this.shadowBlurY];
    }

    update() {
        super.update();

        //this.renderTexure.render(this.image);

        //let renderGroup = this.game.state.getCurrentState().renderGroup;
        //
        //this.renderTexure.renderRawXY(renderGroup, -this.x + this.SIZE / 2, -this.y + this.SIZE / 2, true);
        //this.renderTexure.resize(this.SIZE, this.SIZE, true);
        //this.bitmapData.copyRect(renderGroup, new Phaser.Rectangle(0,0,256,256),0,0);

        //this.bitmapData
        //this.image.tint = 0xff0000;
        //this.renderTexure.renderRawXY(renderGroup, this.x, this.y, true);

        //this.shadowTexureShader.uniforms.iChannel0.value = this.renderTexure.textureBuffer.texture;
        //this.shadowTexureShader.update();

        //debugger;
        //this.lighting.tint = 0xFF0000;

        this.game.debug.text('haha', 0, this.game.height - 10);
    }

    render() {
        //let renderGroup = this.game.state.getCurrentState().renderGroup;
        //this.renderTexure.renderRawXY(renderGroup, -this.x + this.SIZE / 2, -this.y + this.SIZE / 2, true);
        //this.shadowTexureShader.uniforms.iChannel0.value = this.renderTexure.textureBuffer.texture;
        //this.shadowTexureShader.update();
        //this.game.debug.text('haha', 0, this.game.height - 10);
    }
}

export default Light;