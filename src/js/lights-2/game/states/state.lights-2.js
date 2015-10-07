//let Phaser = require('phaser/build/custom/phaser-no-physics.min.js');

let _ = require('lodash');
let Texture = require('./textures/texture');
let Sprite = require('../entities/sprite');
//let mixinSpam = require('../mixins/mixin-spam');
let mixinCtrlArrows = require('../mixins/mixin-controllable-arrows');

let sprite;
let bacteria;

class Lights2State extends Phaser.State {
    constructor(...args) {
        super(...args);
    }

    preload() {
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
        // shaders:
        this.grayShader = new Phaser.Filter(this.game, null, require('../shaders/gray.frag'));
        this.lightShader = new Phaser.Filter(this.game, {
            lightDirection: {type: '3fv', value: [.5,.5,1.0]}
            , lightColor: {type: '4fv', value: [.1,.1,.1,1.0]}
        }, require('../shaders/lights.frag'));

        this.shadowShader = new Phaser.Filter(this.game, {
            uLightDirection: {type: '3fv', value: [.5,.5,1.0]}
            , uLightColor: {type: '4fv', value: [.1,.1,.1,1.0]}
            , uLightPosition: {type: '3fv', value: [.1,.1,.1]}
            , uTexStep: {type: '1f', value: 0.1}
        }, require('../shaders/shadow2.frag'));

        // img:
        this.floor = new Texture(this.game, require('./textures/floor'));

        let mansionDiffuse = new Phaser.RenderTexture(this.game, 144, 96, 'mansionDiffuse');
        mansionDiffuse.renderRawXY(new Phaser.Image(this.game, 0, 0, "mansionNormals"), 0, 0);

        let mansionNormal = new Phaser.RenderTexture(this.game, 144, 96, 'mansionNormal');
        mansionNormal.renderRawXY(new Phaser.Image(this.game, 0, 0, "mansionNormals"), -144, 0);

        let mansionShadow = new Phaser.RenderTexture(this.game, 512, 512, 'mansionShadow');
        //mansionShadow.renderXY(new Phaser.Image(this.game, 144, 96, "mansionNormals"), -144, 0);

        let mansionShadowFill = this.game.add.bitmapData(this.game.width, this.game.height);
        //mansionShadowFill.context.fillStyle = 'rgb(255, 255, 255)';
        //mansionShadowFill.context.fillRect(0, 0, this.game.width, this.game.height);

        mansionShadowFill.copyRect("mansionNormals", new Phaser.Rectangle(144, 0, 144, 96), 144, 96);

        let imgMansionShadow = this.game.add.image(0, 0, mansionShadowFill);

        imgMansionShadow.filters = [this.shadowShader];
        imgMansionShadow.blendMode = Phaser.blendModes.DARKEN;

        let imgMansion = this.game.add.image(144, 96, mansionDiffuse);

        let imgMansionNormal = this.game.add.image(144, 96, mansionNormal);
        //
        //imgMansion.filters = [this.lightShader];
        imgMansionNormal.filters = [this.lightShader];
        imgMansionNormal.blendMode = Phaser.blendModes.DARKEN;

        //this.gradientShader = new Phaser.Filter(this.game, null, require('../shaders/gradient.frag'));
        //
        //this.lightShader = new Phaser.Filter(this.game, {
        //}, require('../shaders/lights.frag'));
        //this.lightShader.setResolution(256, 256);
        //
        //this.l1 = new Phaser.Filter(this.game, {
        //    lait: {type: '3f', value: [100.0, 100.0, 15.0]}
        //    , lights: {type: '3f', value: [[100.0, 100.0, 15.0], [100.0, 150.0, 20.0]]}
        //}, require('../shaders/l1.frag'));
        //
        //// floor
        //this.floor = new Texture(this.game, require('./textures/floor'));
        //
        //this.lights = new Texture(this.game, require('./textures/lights'));
        //
        //this.lights.image.filters = [this.lightShader];

    }

    update() {
        let pointer = {
            x: this.game.input.activePointer.x
            , y: this.game.input.activePointer.y
        };

        let pointer2 = {
            x: this.game.input.activePointer.x
            , y: this.game.input.activePointer.y
        };

        pointer.x = 2 + 1 - (pointer.x / 144 * 2);
        pointer.y = 2 + 1 - (pointer.y / 96 * 2);

        this.game.debug.text(`${Math.floor(pointer.x*100)/100}:${Math.floor(pointer.y*100)/100}`, 0, this.game.height - 20);
        this.game.debug.text(`${Math.floor(pointer2.x/256*100)/100}:${Math.floor(pointer2.y/256*100)/100}`, 0, this.game.height - 5);

        this.lightShader.uniforms.lightDirection.value[0] = pointer.x;
        this.lightShader.uniforms.lightDirection.value[1] = pointer.y;
        this.lightShader.update();

        this.shadowShader.uniforms.uLightDirection.value[0] = -pointer.x;
        this.shadowShader.uniforms.uLightDirection.value[1] = pointer.y;
        this.shadowShader.uniforms.uLightDirection.value[2] = this.height;

        this.shadowShader.uniforms.uLightPosition.value[0] = pointer2.x;
        this.shadowShader.uniforms.uLightPosition.value[1] = pointer2.y;
        this.shadowShader.uniforms.uLightPosition.value[2] = this.height;
        this.shadowShader.update();
    }
}

export default Lights2State;


































