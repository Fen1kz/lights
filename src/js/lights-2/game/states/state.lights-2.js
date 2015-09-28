//let Phaser = require('phaser/build/custom/phaser-no-physics.min.js');

let _ = require('lodash');
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
            iResolution: {type: '2f', value:[this.game.width, this.game.height]}
        }, require('../shaders/lights.frag'));
        this.lightShader.setResolution(this.game.width, this.game.height);

        // floor
        this.floorBD = this.game.add.bitmapData(this.game.width, this.game.height);
        this.floorBD.context.beginPath();
        this.floorBD.context.fillStyle = 'rgb(128, 255, 128)';
        this.floorBD.context.fillRect(0, 0, this.game.width, this.game.height);
        this.floorBD.context.fill();
        this.floorBD.context.strokeStyle = 'rgb(0, 128, 0)';
        for (let i = 50; i <= this.game.width; i += 50) {
            this.floorBD.context.strokeRect(0, 0, i, this.game.height);
        }
        for (let i = 50; i <= this.game.height; i += 50) {
            this.floorBD.context.strokeRect(0, 0, this.game.width, i);
        }
        this.floorBD.context.closePath();
        this.floorImage = this.game.add.image(0, 0, this.floorBD);

        // light bitmap
        this.lightBitmapData = this.game.add.bitmapData(this.game.width, this.game.height);
        this.lightBitmapData.context.fillStyle = 'rgb(255, 255, 255)';
        this.lightBitmapData.context.fillRect(0, 0, this.game.width, this.game.height);
        //this.bitmap.context.strokeStyle = 'rgb(255, 0, 0)';
        this.lightImage = this.game.add.image(0, 0, this.lightBitmapData);

        this.lightBitmapData.context.strokeStyle = 'rgb(0, 128, 0)';
        for (let i = 50; i <= this.game.width; i += 50) {
            this.lightBitmapData.context.strokeRect(0, 0, i, this.game.height);
        }
        for (let i = 50; i <= this.game.height; i += 50) {
            this.lightBitmapData.context.strokeRect(0, 0, this.game.width, i);
        }


        this.lightBitmapData.context.beginPath();
        this.lightBitmapData.context.fillStyle = 'rgb(0, 0, 255)';
        this.lightBitmapData.context.arc(this.game.width / 2, this.game.height / 2, 10, 0, 2 * Math.PI);
        this.lightBitmapData.context.fill();
        this.lightBitmapData.context.closePath();

        this.lightBitmapData.context.beginPath();
        this.lightBitmapData.context.fillStyle = 'rgb(0, 0, 0)';
        this.lightBitmapData.context.arc(420, 150, 50, 0, 2 * Math.PI);
        this.lightBitmapData.context.fill();
        this.lightBitmapData.context.closePath();


        this.lightBitmapData.context.beginPath();
        this.lightBitmapData.context.arc(220, 120, 30, 0, 2 * Math.PI);
        this.lightBitmapData.context.clip();
        this.lightBitmapData.context.clearRect(0,0,this.game.width, this.game.height);
        this.lightBitmapData.context.closePath();

        this.lightImage.filters = [this.lightShader];

        //this.lightImage.filters = [this.gradientShader];

        //this.lightImage.blendMode = Phaser.blendModes.MULTIPLY;










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

    update() {
        this.gradientShader.update();
        this.lightShader.update();

        //this.bitmap.context.fillStyle = 'rgb(100, 100, 100)';
        //this.bitmap.context.fillRect(0, 0, this.game.width, this.game.height);
        //this.rayBitmap.context.clearRect(0, 0, this.game.width, this.game.height);
        //this.debugBitmap.context.clearRect(0, 0, this.game.width, this.game.height);
        //
        //this.game.arrays.lights.forEach((light) => {
        //    this.debugBitmap.context.beginPath();
        //    this.debugBitmap.context.lineWidth = 1;
        //    this.debugBitmap.context.arc(light.x, light.y, 150, 0, Math.PI * 2);
        //    this.debugBitmap.context.stroke();
        //});
        //
        //// An array of the stage corners that we'll use later
        //var stageCorners = [
        //    new Phaser.Point(0, 0),
        //    new Phaser.Point(this.game.width, 0),
        //    new Phaser.Point(this.game.width, this.game.height),
        //    new Phaser.Point(0, this.game.height)
        //];
        //
        //this.game.arrays.lights.forEach((light) => {
        //    var points = [];
        //    var ray = null;
        //    var intersect;
        //    var i;
        //
        //    this.walls.forEach(function (wall) {
        //        // Create a ray from the light through each corner out to the edge of the stage.
        //        // This array defines points just inside of each corner to make sure we hit each one.
        //        // It also defines points just outside of each corner so we can see to the stage edges.
        //        var corners = [
        //            new Phaser.Point(wall.x + 0.1, wall.y + 0.1),
        //            new Phaser.Point(wall.x - 0.1, wall.y - 0.1),
        //
        //            new Phaser.Point(wall.x - 0.1 + wall.width, wall.y + 0.1),
        //            new Phaser.Point(wall.x + 0.1 + wall.width, wall.y - 0.1),
        //
        //            new Phaser.Point(wall.x - 0.1 + wall.width, wall.y - 0.1 + wall.height),
        //            new Phaser.Point(wall.x + 0.1 + wall.width, wall.y + 0.1 + wall.height),
        //
        //            new Phaser.Point(wall.x + 0.1, wall.y - 0.1 + wall.height),
        //            new Phaser.Point(wall.x - 0.1, wall.y + 0.1 + wall.height)
        //        ];
        //
        //        // Calculate rays through each point to the edge of the stage
        //        for (i = 0; i < corners.length; i++) {
        //            var c = corners[i];
        //
        //            // Here comes the linear algebra.
        //            // The equation for a line is y = slope * x + b
        //            // b is where the line crosses the left edge of the stage
        //            var slope = (c.y - light.y) / (c.x - light.x);
        //            var b = light.y - slope * light.x;
        //
        //            var end = null;
        //
        //            if (c.x === light.x) {
        //                // Vertical lines are a special case
        //                if (c.y <= light.y) {
        //                    end = new Phaser.Point(light.x, 0);
        //                } else {
        //                    end = new Phaser.Point(light.x, this.game.height);
        //                }
        //            } else if (c.y === light.y) {
        //                // Horizontal lines are a special case
        //                if (c.x <= light.x) {
        //                    end = new Phaser.Point(0, light.y);
        //                } else {
        //                    end = new Phaser.Point(this.game.width, light.y);
        //                }
        //            } else {
        //                // Find the point where the line crosses the stage edge
        //                var left = new Phaser.Point(0, b);
        //                var right = new Phaser.Point(this.game.width, slope * this.game.width + b);
        //                var top = new Phaser.Point(-b / slope, 0);
        //                var bottom = new Phaser.Point((this.game.height - b) / slope, this.game.height);
        //
        //                // Get the actual intersection point
        //                if (c.y <= light.y && c.x >= light.x) {
        //                    if (top.x >= 0 && top.x <= this.game.width) {
        //                        end = top;
        //                    } else {
        //                        end = right;
        //                    }
        //                } else if (c.y <= light.y && c.x <= light.x) {
        //                    if (top.x >= 0 && top.x <= this.game.width) {
        //                        end = top;
        //                    } else {
        //                        end = left;
        //                    }
        //                } else if (c.y >= light.y && c.x >= light.x) {
        //                    if (bottom.x >= 0 && bottom.x <= this.game.width) {
        //                        end = bottom;
        //                    } else {
        //                        end = right;
        //                    }
        //                } else if (c.y >= light.y && c.x <= light.x) {
        //                    if (bottom.x >= 0 && bottom.x <= this.game.width) {
        //                        end = bottom;
        //                    } else {
        //                        end = left;
        //                    }
        //                }
        //            }
        //
        //            // Create a ray
        //            ray = new Phaser.Line(light.x, light.y, end.x, end.y);
        //
        //            // Check if the ray intersected the wall
        //            intersect = this.getWallIntersection(ray);
        //            if (intersect) {
        //                // This is the front edge of the light blocking object
        //                points.push(intersect);
        //            } else {
        //                // Nothing blocked the ray
        //                points.push(ray.end);
        //            }
        //        }
        //    }, this);
        //
        //
        //    // Shoot rays at each of the stage corners to see if the corner
        //    // of the stage is in shadow. This needs to be done so that
        //    // shadows don't cut the corner.
        //    for (i = 0; i < stageCorners.length; i++) {
        //        ray = new Phaser.Line(light.x, light.y,
        //            stageCorners[i].x, stageCorners[i].y);
        //        intersect = this.getWallIntersection(ray);
        //        if (!intersect) {
        //            // Corner is in light
        //            points.push(stageCorners[i]);
        //        }
        //    }
        //
        //    // Now sort the points clockwise around the light
        //    // Sorting is required so that the points are connected in the right order.
        //    //
        //    // This sorting algorithm was copied from Stack Overflow:
        //    // http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
        //    //
        //    // Here's a pseudo-code implementation if you want to code it yourself:
        //    // http://en.wikipedia.org/wiki/Graham_scan
        //    var center = {x: light.x, y: light.y};
        //    points = points.sort(function (a, b) {
        //        if (a.x - center.x >= 0 && b.x - center.x < 0)
        //            return 1;
        //        if (a.x - center.x < 0 && b.x - center.x >= 0)
        //            return -1;
        //        if (a.x - center.x === 0 && b.x - center.x === 0) {
        //            if (a.y - center.y >= 0 || b.y - center.y >= 0)
        //                return 1;
        //            return -1;
        //        }
        //
        //        // Compute the cross product of vectors (center -> a) x (center -> b)
        //        var det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
        //        if (det < 0)
        //            return 1;
        //        if (det > 0)
        //            return -1;
        //
        //        // Points a and b are on the same line from the center
        //        // Check which point is closer to the center
        //        var d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
        //        var d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
        //        return 1;
        //    });
        //
        //    // Connect the dots and fill in the shape, which are cones of light,
        //    // with a bright white color. When multiplied with the background,
        //    // the white color will allow the full color of the background to
        //    // shine through.
        //    this.bitmap.context.beginPath();
        //    this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        //    this.bitmap.context.moveTo(points[0].x, points[0].y);
        //    for (var j = 0; j < points.length; j++) {
        //        this.bitmap.context.lineTo(points[j].x, points[j].y);
        //    }
        //    this.bitmap.context.closePath();
        //    this.bitmap.context.fill();
        //
        //    // Draw each of the rays on the rayBitmap
        //    this.rayBitmap.context.beginPath();
        //    this.rayBitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        //    this.rayBitmap.context.fillStyle = 'rgb(255, 255, 255)';
        //    this.rayBitmap.context.moveTo(points[0].x, points[0].y);
        //    for (var k = 0; k < points.length; k++) {
        //        this.rayBitmap.context.moveTo(light.x, light.y);
        //        this.rayBitmap.context.lineTo(points[k].x, points[k].y);
        //        this.rayBitmap.context.fillRect(points[k].x - 2, points[k].y - 2, 4, 4);
        //    }
        //    this.rayBitmap.context.stroke();
        //});
        //// This just tells the engine it should update the texture cache
        //this.bitmap.dirty = true;
        //this.rayBitmap.dirty = true;
        //this.debugBitmap.dirty = true;
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


































