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
    }

    create() {
        // shaders:
        this.grayShader = new Phaser.Filter(this.game, null, require('../shaders/gray.frag'));

        this.gradientShader = new Phaser.Filter(this.game, null, require('../shaders/gradient.frag'));

        this.lightShader = new Phaser.Filter(this.game, {
            iResolution: {type: '2f', value: [this.game.width, this.game.height]}
            , testColor: {type: '1f', value: 1.5}
            , lights: {type: '4f', value: [50, 50, 20, 10]}
        }, require('../shaders/lights.frag'));
        this.lightShader.setResolution(this.game.width, this.game.height);

        this.l1 = new Phaser.Filter(this.game, {
            lait: {type: '3f', value: [100.0, 100.0, 15.0]}
            , lights: {type: '3f', value: [[100.0, 100.0, 15.0], [100.0, 150.0, 20.0]]}
        }, require('../shaders/l1.frag'));

        // floor
        //this.floor = new Texture(this.game, require('./textures/floor'));

        this.lights = new Texture(this.game, require('./textures/lights'));

        this.obstacles = new Texture(this.game, require('./textures/obstacles'));

        this.lights.image.filters = [this.l1];

        //asd


        ////
        ////
        ////// Setup function for hiding or showing rays
        ////this.game.events['light.rays'].add(() => this.rayBitmapImage.visible = !this.rayBitmapImage.visible);
        ////
        ////// Build some walls. These will block line of sight.
        //let NUMBER_OF_WALLS = 4;
        //this.walls = this.game.add.group();
        //this.game.events['box.add'].add((i) => {
        //    let x = i * this.game.width / NUMBER_OF_WALLS + 50;
        //    let y = this.game.rnd.integerInRange(50, this.game.height - 50);
        //    let box = this.game.add.image(x, y, 'block', 0, this.walls);
        //    box.scale.setTo(1.0, 1.0);
        //    box.inputEnabled = true;
        //    box.input.enableDrag(true);
        //    box.input.useHandCursor = true;
        //});
        //this.game.events['box.remove'].add(() => this.walls.removeChildAt(this.walls.length - 1));
        //
        //_.range(NUMBER_OF_WALLS).forEach((i) => this.game.events['box.add'].dispatch(i));

        //this.walls.filters = [this.Blur];
        ////this.light.filters = [];
        ////this.bitmap.filters = ['Blur'];
        //
        //// Create a bitmap for drawing rays
        //this.rayBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        //this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
        //
        //this.debugBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        //this.debugBitmapImage = this.game.add.image(0, 0, this.debugBitmap);
        //this.rayBitmapImage.visible = false;
    }

    render() {
        //let gl = this.game.renderer.gl;
        //let GL = this.game.renderer.gl;
        //window.gl = gl;
        //
        //gl.depthMask(true);
        //gl.clearDepth(1);
        //gl.clearColor(1, 0, 0, 0);
        //gl.clear(GL.COLOR_BUFFER_BIT |
        //    GL.DEPTH_BUFFER_BIT |
        //    GL.STENCIL_BUFFER_BIT);
    }

    update() {
        this.l1.update();
    }

    getWallIntersection(ray) {
        var distanceToWall = Number.POSITIVE_INFINITY;
        var closestIntersection = null;

        // For each of the walls...
        this.walls.forEach(function (wall) {
            // Create an array of lines that represent the four edges of each wall
            var lines = [
                new Phaser.Line(wall.x, wall.y, wall.x + wall.width, wall.y),
                new Phaser.Line(wall.x, wall.y, wall.x, wall.y + wall.height),
                new Phaser.Line(wall.x + wall.width, wall.y,
                    wall.x + wall.width, wall.y + wall.height),
                new Phaser.Line(wall.x, wall.y + wall.height,
                    wall.x + wall.width, wall.y + wall.height)
            ];

            // Test each of the edges in this wall against the ray.
            // If the ray intersects any of the edges then the wall must be in the way.
            for (var i = 0; i < lines.length; i++) {
                var intersect = Phaser.Line.intersects(ray, lines[i]);
                if (intersect) {
                    // Find the closest intersection
                    let distance = this.game.math.distance(ray.start.x, ray.start.y, intersect.x, intersect.y);
                    if (distance < distanceToWall) {
                        distanceToWall = distance;
                        closestIntersection = intersect;
                    }
                }
            }
        }, this);

        return closestIntersection;
    }
}

export default Lights2State;


































