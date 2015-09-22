//let Phaser = require('phaser/build/custom/phaser-no-physics.min.js');

let _ = require('lodash');
let Sprite = require('../entities/sprite');
//let mixinSpam = require('../mixins/mixin-spam');
let mixinCtrlArrows = require('../mixins/mixin-controllable-arrows');

class Lights2State extends Phaser.State {
    constructor(...args) {
        super(...args);
    }

    preload() {
        this.game.load.image("block", "/assets/gfx/block.png");
        this.game.load.image("light", "/assets/gfx/light.png");
    }

    create() {
        // Set stage background color
        this.game.stage.backgroundColor = 0x4488cc;

        // Add the light
        this.game.arrays.lights = [];
        this.game.events['light.add'].add(() => {
            let light = new Sprite(this.game, this.game.width / 2, this.game.height / 2, 'light');

            //  Input Enable the sprites
            light.inputEnabled = true;
            //  Allow dragging - the 'true' parameter will make the sprite snap to the center
            light.input.enableDrag(true);
            light.input.useHandCursor = true;


            this.light = light;
            this.game.arrays.lights.push(light);
        });
        this.game.events['light.add'].dispatch();

        this.game.events['light.remove'].add(() => this.game.arrays.lights.shift().destroy());

        // Create a bitmap texture for drawing light cones
        this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        //this.bitmap.context.fillStyle = 'rgb(255, 0, 255)';
        //this.bitmap.context.strokeStyle = 'rgb(255, 0, 0)';
        var lightBitmap = this.game.add.image(0, 0, this.bitmap);

        // This bitmap is drawn onto the screen using the MULTIPLY blend mode.
        // Since this bitmap is over the background, dark areas of the bitmap
        // will make the background darker. White areas of the bitmap will allow
        // the normal colors of the background to show through. Blend modes are
        // only supported in WebGL. If your browser doesn't support WebGL then
        // you'll see gray shadows and white light instead of colors and it
        // generally won't look nearly as cool. So use a browser with WebGL.
        lightBitmap.blendMode = Phaser.blendModes.MULTIPLY;

        // Create a bitmap for drawing rays
        this.rayBitmap = this.game.add.bitmapData(this.game.width, this.game.height);
        this.rayBitmapImage = this.game.add.image(0, 0, this.rayBitmap);
        //this.rayBitmapImage.visible = false;

        // Setup function for hiding or showing rays
        this.game.events['light.rays'].add(() => this.rayBitmapImage.visible = !this.rayBitmapImage.visible);

        // Build some walls. These will block line of sight.
        let NUMBER_OF_WALLS = 4;
        this.walls = this.game.add.group();
        this.game.events['box.add'].add((i) => {
            let x = i * this.game.width / NUMBER_OF_WALLS + 50;
            let y = this.game.rnd.integerInRange(50, this.game.height - 50);
            let box = this.game.add.image(x, y, 'block', 0, this.walls);
            box.scale.setTo(1.0, 1.0);
            box.inputEnabled = true;
            box.input.enableDrag(true);
            box.input.useHandCursor = true;
        });
        this.game.events['box.remove'].add(() => this.walls.removeChildAt(this.walls.length - 1));

        _.range(NUMBER_OF_WALLS).forEach((i) => this.game.events['box.add'].dispatch(i));
    }

    update() {
        // Move the light to the pointer/touch location
        //this.light.x = this.game.input.activePointer.x;
        //this.light.y = this.game.input.activePointer.y;

        // Next, fill the entire light bitmap with a dark shadow color.
        this.bitmap.context.fillStyle = 'rgb(100, 100, 100)';
        this.bitmap.context.fillRect(0, 0, this.game.width, this.game.height);

        // An array of the stage corners that we'll use later
        var stageCorners = [
            new Phaser.Point(0, 0),
            new Phaser.Point(this.game.width, 0),
            new Phaser.Point(this.game.width, this.game.height),
            new Phaser.Point(0, this.game.height)
        ];

        // Ray casting!
        // Cast rays through the corners of each wall towards the stage edge.
        // Save all of the intersection points or ray end points if there was no intersection.
        var points = [];
        var ray = null;
        var intersect;
        var i;

        this.walls.forEach(function (wall) {
            // Create a ray from the light through each corner out to the edge of the stage.
            // This array defines points just inside of each corner to make sure we hit each one.
            // It also defines points just outside of each corner so we can see to the stage edges.
            var corners = [
                new Phaser.Point(wall.x + 0.1, wall.y + 0.1),
                new Phaser.Point(wall.x - 0.1, wall.y - 0.1),

                new Phaser.Point(wall.x - 0.1 + wall.width, wall.y + 0.1),
                new Phaser.Point(wall.x + 0.1 + wall.width, wall.y - 0.1),

                new Phaser.Point(wall.x - 0.1 + wall.width, wall.y - 0.1 + wall.height),
                new Phaser.Point(wall.x + 0.1 + wall.width, wall.y + 0.1 + wall.height),

                new Phaser.Point(wall.x + 0.1, wall.y - 0.1 + wall.height),
                new Phaser.Point(wall.x - 0.1, wall.y + 0.1 + wall.height)
            ];

            // Calculate rays through each point to the edge of the stage
            for (i = 0; i < corners.length; i++) {
                var c = corners[i];

                // Here comes the linear algebra.
                // The equation for a line is y = slope * x + b
                // b is where the line crosses the left edge of the stage
                var slope = (c.y - this.light.y) / (c.x - this.light.x);
                var b = this.light.y - slope * this.light.x;

                var end = null;

                if (c.x === this.light.x) {
                    // Vertical lines are a special case
                    if (c.y <= this.light.y) {
                        end = new Phaser.Point(this.light.x, 0);
                    } else {
                        end = new Phaser.Point(this.light.x, this.game.height);
                    }
                } else if (c.y === this.light.y) {
                    // Horizontal lines are a special case
                    if (c.x <= this.light.x) {
                        end = new Phaser.Point(0, this.light.y);
                    } else {
                        end = new Phaser.Point(this.game.width, this.light.y);
                    }
                } else {
                    // Find the point where the line crosses the stage edge
                    var left = new Phaser.Point(0, b);
                    var right = new Phaser.Point(this.game.width, slope * this.game.width + b);
                    var top = new Phaser.Point(-b / slope, 0);
                    var bottom = new Phaser.Point((this.game.height - b) / slope, this.game.height);

                    // Get the actual intersection point
                    if (c.y <= this.light.y && c.x >= this.light.x) {
                        if (top.x >= 0 && top.x <= this.game.width) {
                            end = top;
                        } else {
                            end = right;
                        }
                    } else if (c.y <= this.light.y && c.x <= this.light.x) {
                        if (top.x >= 0 && top.x <= this.game.width) {
                            end = top;
                        } else {
                            end = left;
                        }
                    } else if (c.y >= this.light.y && c.x >= this.light.x) {
                        if (bottom.x >= 0 && bottom.x <= this.game.width) {
                            end = bottom;
                        } else {
                            end = right;
                        }
                    } else if (c.y >= this.light.y && c.x <= this.light.x) {
                        if (bottom.x >= 0 && bottom.x <= this.game.width) {
                            end = bottom;
                        } else {
                            end = left;
                        }
                    }
                }

                // Create a ray
                ray = new Phaser.Line(this.light.x, this.light.y, end.x, end.y);

                // Check if the ray intersected the wall
                intersect = this.getWallIntersection(ray);
                if (intersect) {
                    // This is the front edge of the light blocking object
                    points.push(intersect);
                } else {
                    // Nothing blocked the ray
                    points.push(ray.end);
                }
            }
        }, this);


        // Shoot rays at each of the stage corners to see if the corner
        // of the stage is in shadow. This needs to be done so that
        // shadows don't cut the corner.
        for(i = 0; i < stageCorners.length; i++) {
            ray = new Phaser.Line(this.light.x, this.light.y,
                stageCorners[i].x, stageCorners[i].y);
            intersect = this.getWallIntersection(ray);
            if (!intersect) {
                // Corner is in light
                points.push(stageCorners[i]);
            }
        }

        // Now sort the points clockwise around the light
        // Sorting is required so that the points are connected in the right order.
        //
        // This sorting algorithm was copied from Stack Overflow:
        // http://stackoverflow.com/questions/6989100/sort-points-in-clockwise-order
        //
        // Here's a pseudo-code implementation if you want to code it yourself:
        // http://en.wikipedia.org/wiki/Graham_scan
        var center = { x: this.light.x, y: this.light.y };
        points = points.sort(function(a, b) {
            if (a.x - center.x >= 0 && b.x - center.x < 0)
                return 1;
            if (a.x - center.x < 0 && b.x - center.x >= 0)
                return -1;
            if (a.x - center.x === 0 && b.x - center.x === 0) {
                if (a.y - center.y >= 0 || b.y - center.y >= 0)
                    return 1;
                return -1;
            }

            // Compute the cross product of vectors (center -> a) x (center -> b)
            var det = (a.x - center.x) * (b.y - center.y) - (b.x - center.x) * (a.y - center.y);
            if (det < 0)
                return 1;
            if (det > 0)
                return -1;

            // Points a and b are on the same line from the center
            // Check which point is closer to the center
            var d1 = (a.x - center.x) * (a.x - center.x) + (a.y - center.y) * (a.y - center.y);
            var d2 = (b.x - center.x) * (b.x - center.x) + (b.y - center.y) * (b.y - center.y);
            return 1;
        });

        // Connect the dots and fill in the shape, which are cones of light,
        // with a bright white color. When multiplied with the background,
        // the white color will allow the full color of the background to
        // shine through.
        this.bitmap.context.beginPath();
        this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.bitmap.context.moveTo(points[0].x, points[0].y);
        for(var j = 0; j < points.length; j++) {
            this.bitmap.context.lineTo(points[j].x, points[j].y);
        }
        this.bitmap.context.closePath();
        this.bitmap.context.fill();

        // Draw each of the rays on the rayBitmap
        this.rayBitmap.context.clearRect(0, 0, this.game.width, this.game.height);
        this.rayBitmap.context.beginPath();
        this.rayBitmap.context.strokeStyle = 'rgb(255, 255, 255)';
        this.rayBitmap.context.fillStyle = 'rgb(255, 255, 255)';
        this.rayBitmap.context.moveTo(points[0].x, points[0].y);
        for(var k = 0; k < points.length; k++) {
            this.rayBitmap.context.moveTo(this.light.x, this.light.y);
            this.rayBitmap.context.lineTo(points[k].x, points[k].y);
            this.rayBitmap.context.fillRect(points[k].x-2, points[k].y-2, 4, 4);
        }
        this.rayBitmap.context.stroke();

        // This just tells the engine it should update the texture cache
        this.bitmap.dirty = true;
        this.rayBitmap.dirty = true;
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


































