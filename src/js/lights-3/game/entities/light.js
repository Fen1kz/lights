let Sprite = require('./sprite');

class Light extends Sprite {
    constructor(...args) {
        super(...args);

        this.grayShader = new Phaser.Filter(this.game, null, require('../shaders/gray.frag'));

        this.shadowTexureShader = new Phaser.Filter(this.game, {
            lightColor: {type: '4fv', value: [1,1,1,1.0]}
        }, require('../shaders/shadow.frag'));
        this.shadowTexureShader.setResolution(256, 256);

        this.shadowCastShader = new Phaser.Filter(this.game, {
            lightColor: {type: '4fv', value: [1,1,1,1.0]}
            , lightsCount: {type: '1f', value: 1}
            , lightDistance: {type: '1f', value: 1}
            , pixelMapSize: {type: '2fv', value: [256,256]}
            , lightPos: {type: '2fv', value: [.5,.5]}
        }, require('../shaders/cast-shadow.frag'));
        this.shadowCastShader.setResolution(256, 256);

        //console.log('light');

        this.renderTexure = new Phaser.RenderTexture(this.game, 256, 256);

        this.bitmapData = new Phaser.BitmapData(this.game, 256, 256);
        this.bitmapData.context.fillStyle = 'rgb(0, 0, 0)';
        this.bitmapData.context.fillRect(0, 0, this.game.width, this.game.height);
        this.bitmapData.context.fill();

        //let graphics = new Phaser.Graphics(this.game, 256, 256);
        //graphics.beginFill(0x0);
        //graphics.drawRect(0,0, 256,256);
        //graphics.endFill();

        this.image = new Phaser.Image(this.game, 0, 0, this.bitmapData);

        //this.renderTexure.renderRawXY(this.game.stage, 0,0);

        this.lighting = new Phaser.Image(this.game, -128, -128, this.renderTexure);

        this.lighting.filters = [this.shadowTexureShader];
        //this.lighting.filters = [this.shadowTexureShader, this.shadowCastShader];

        this.addChild(this.lighting);
    }

    update() {
        super.update();

        //this.renderTexure.render(this.image);

        let renderGroup = this.game.state.getCurrentState().renderGroup;
        this.renderTexure.renderRawXY(renderGroup, -this.x + 128, -this.y + 128, true);
        //this.lighting.tint = 0xFF0000;

        this.game.debug.text('haha', 0, this.game.height - 10);
    }

    render() {
    }
}

export default Light;