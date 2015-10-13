//let Phaser = require('phaser/build/custom/phaser-no-physics.min.js');

let _ = require('lodash');
let Texture = require('./textures/texture');
let Sprite = require('../entities/sprite');
let Light = require('../entities/light');
//let mixinSpam = require('../mixins/mixin-spam');
let mixinCtrlArrows = require('../mixins/mixin-controllable-arrows');

let sprite;
let bacteria;

class Lights2State extends Phaser.State {
    constructor(...args) {
        super(...args);
    }

    preload() {
        this.game.load.baseURL = (this.game.config.baseUrl != "/") ? this.game.config.baseUrl : "";
        this.game.load.image("block", "/assets/gfx/block.png");
        this.game.load.image("light", "/assets/gfx/light.png");
        this.game.load.image("texture1", "/assets/gfx/texture1.png");
        this.game.load.image("mansionNormals", "/assets/gfx/mansionNormals.png");

        this.grayShader = new Phaser.Filter(this.game, null, require('../shaders/bacteria.frag'));

        this.height = 1.0;
        this.game.events['slider.change'].add((value) => {
            this.height = value;
        });
    }

    create() {
        this.floor = new Texture(this.game, require('./textures/floor'));

        this.SHADER_SIZE = 256;

        this.shadowTexureShader = new Phaser.Filter(this.game, {
            uLightColor: {type: '4fv', value: [1, 1, 1, 1.0]}
            , uLightPosition: {type: '2fv', value: [0.0, 0.0]}
            , gameResolution: {type: '2fv', value: [this.game.width, this.game.height]}
            , shaderResolution: {type: '2fv', value: [this.SHADER_SIZE, this.SHADER_SIZE]}
            , iChannel0: {type: 'sampler2D', value: void 0}
        }, require('../shaders/shadow.frag'));
        this.shadowTexureShader.setResolution(this.SHADER_SIZE, this.SHADER_SIZE);


        this.shadowCastShader = new Phaser.Filter(this.game, {
            lightColor: {type: '4fv', value: [1, 1, 1, 1.0]}
            , uLightPosition: {type: '2fv', value: [0.0, 0.0]}
            , gameResolution: {type: '2fv', value: [this.game.width, this.game.height]}
            , shaderResolution: {type: '2fv', value: [this.SHADER_SIZE, this.SHADER_SIZE]}
            , iChannel0: {type: 'sampler2D', value: void 0}
        }, require('../shaders/cast-shadow.frag'));
        this.shadowCastShader.setResolution(this.SHADER_SIZE, this.SHADER_SIZE);

        let mansionDiffuse = new Phaser.RenderTexture(this.game, 144, 96, 'mansionDiffuse');
        mansionDiffuse.renderRawXY(new Phaser.Image(this.game, 0, 0, "mansionNormals"), 0, 0);

        let imgMansion = this.game.make.image(144, 96, mansionDiffuse);
        this.renderGroup = this.game.add.group();

        this.renderGroup.add(imgMansion);

        this.renderGroup.add(new Texture(this.game, require('./textures/circle')('255,0,0', 250, 150)).image);

        this.renderGroup.add(new Texture(this.game, require('./textures/circle')('0,255,0', 150, 250)).image);
        this.renderGroup.add(new Texture(this.game, require('./textures/circle')('0,0,255', 250, 350)).image);

        //this.renderGroup.add(this.floor.image);
        this.light = new Light(this.game);

        this.lightingRT = this.game.make.renderTexture(this.game.width, this.game.height);
        this.lightingImage = this.game.add.image(0, 0, this.lightingRT);
        this.lightingImage.filters = [this.shadowCastShader];

        this.shadowMapRT = this.game.make.renderTexture(this.game.width, this.game.width);
        this.shadowMapImage = this.game.add.image(0, 0, this.shadowMapRT);
        //this.shadowMapImage.filters = [this.shadowTexureShader];
        this.shadowMapImage.filters = [this.shadowTexureShader, this.shadowCastShader];

        //this.shadowLightRT = this.game.make.renderTexture(this.game.width, this.game.height);
        //this.shadowLightImage = this.game.make.sprite(0, 0, this.shadowLightRT);
        //this.shadowLightImage.filters = [this.shadowCastShader];

        this.shadowTexureShader.uniforms.iChannel0.value = this.lightingRT;
        this.shadowCastShader.uniforms.iChannel0.value = this.shadowMapRT;
        window.state = this;
    }

    update() {
        this.light.x = this.game.input.activePointer.x;
        this.light.y = this.game.input.activePointer.y;
        //this.lightingImage.x = this.game.input.activePointer.x;
        //this.lightingImage.y = this.game.input.activePointer.y;

        this.lightingRT.renderRawXY(this.renderGroup, 0, 0, true);

        this.shadowTexureShader.uniforms.uLightPosition.value = [this.light.x, this.light.y];
        this.shadowTexureShader.update();

        this.shadowCastShader.uniforms.uLightPosition.value = [this.light.x, this.light.y];
        this.shadowCastShader.update();


        //this.lightingRT.renderRawXY(this.renderGroup, -this.x + 360 / 2, -this.y + 250 / 2, true);
    }

    render() {
        //this.light.render();
    }
}

export default Lights2State;