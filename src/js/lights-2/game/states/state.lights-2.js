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
    }

    create() {
        // shaders:
        this.grayShader = new Phaser.Filter(this.game, null, require('../shaders/gray.frag'));
        this.lightShader = new Phaser.Filter(this.game, {
            lightDirection: {type: '3fv', value: [.5,.5,1.0]}
            , lightColor: {type: '4fv', value: [.1,.1,.1,1.0]}
        }, require('../shaders/lights.frag'));

        // img:
        let mansionDiffuse = new Phaser.RenderTexture(this.game, 144, 96, 'mansionDiffuse');
        mansionDiffuse.renderRawXY(new Phaser.Image(this.game, 0, 0, "mansionNormals"), 0, 0);

        let mansionNormal = new Phaser.RenderTexture(this.game, 144, 96, 'mansionNormal');

        mansionNormal.renderRawXY(new Phaser.Image(this.game, 0, 0, "mansionNormals"), -144, 0);

        //mansionDiffuse.shader = this.grayShader;
        //mansionDiffuse.shaders = [this.grayShader];
        //mansionDiffuse.filter = this.grayShader;
        //mansionDiffuse.filters = [this.grayShader];

        let imgMansion = this.game.add.image(144, 96, mansionDiffuse);

        let imgMansionNormal = this.game.add.image(144, 96, mansionNormal);

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

        pointer.x = 2 - pointer.x / 144;
        pointer.y = 2 - pointer.y / 96;

        //this.game.debug.text(`${pointer.x}:${pointer.y}`, 200, 200);

        this.lightShader.uniforms.lightDirection.value[0] = pointer.x;
        this.lightShader.uniforms.lightDirection.value[1] = pointer.y;
        this.lightShader.update();
    }
}

export default Lights2State;


































