let Sprite = require('./sprite');

class Light extends Sprite {
    constructor(...args) {
        super(...args);

        this.SIZE = 256;

        this.grayShader = new Phaser.Filter(this.game, null, require('../shaders/gray.frag'));

        this.shadowTexureShader = new Phaser.Filter(this.game, {
            lightColor: {type: '4fv', value: [1,1,1,1.0]}
            , gameResolution: { type: '2fv', value: [this.game.width, this.game.height] }
            , shaderResolution: { type: '2fv', value: [this.SIZE, this.SIZE] }
            , iChannel0: { type: 'sampler2D', value: [] }
        }, require('../shaders/shadow.frag'));
        this.shadowTexureShader.setResolution(this.SIZE, this.SIZE);

        this.shadowCastShader = new Phaser.Filter(this.game, {
            lightColor: {type: '4fv', value: [1,1,1,1.0]}
            , gameResolution: { type: '2fv', value: [this.game.width, this.game.height] }
            , shaderResolution: { type: '2fv', value: [this.SIZE, this.SIZE] }
        }, require('../shaders/cast-shadow.frag'));
        this.shadowCastShader.setResolution(this.SIZE, this.SIZE);

        this.renderTexure = new Phaser.RenderTexture(this.game, this.SIZE, this.SIZE);

        //this.renderTexure.renderRawXY(this.game.stage, 0,0);

        this.lighting = new Phaser.Image(this.game, -this.SIZE / 2, -this.SIZE / 2, this.renderTexure);
        //this.lighting = new Phaser.Image(this.game, 0, 0, this.renderTexure);


        this.addChild(this.lighting);

        //console.log('light');
        this.bitmapData = new Phaser.BitmapData(this.game, 255, 255);
        this.bitmapData.context.fillStyle = 'rgb(128, 128, 128)';
        this.bitmapData.context.fillRect(0, 0, 255, 255);
        this.bitmapData.context.fill();

        this.image = new Phaser.Image(this.game, 0, 0, this.bitmapData);
        //this.addChild(this.image);
        //this.image.filters = [this.shadowTexureShader];

        this.lighting.filters = [this.shadowTexureShader];
        //this.lighting.filters = [this.shadowTexureShader, this.shadowCastShader];
    }

    update() {
        super.update();

        //this.renderTexure.render(this.image);

        let renderGroup = this.game.state.getCurrentState().renderGroup;

        this.renderTexure.renderRawXY(renderGroup, -this.x + this.SIZE / 2, -this.y + this.SIZE / 2, true);
        //this.renderTexure.resize(this.SIZE, this.SIZE, true);
        //this.bitmapData.copyRect(renderGroup, new Phaser.Rectangle(0,0,256,256),0,0);

        //this.bitmapData
        //this.image.tint = 0xff0000;
        //this.renderTexure.renderRawXY(renderGroup, this.x, this.y, true);

        this.shadowTexureShader.uniforms.iChannel0.value = this.renderTexure.textureBuffer.texture;
        this.shadowTexureShader.update();

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