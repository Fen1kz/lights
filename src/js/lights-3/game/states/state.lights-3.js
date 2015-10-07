/**
 *
 * Empty demo file, loads a texture and sets up the renderer...
 *
 */

// created while the data is loading (preloader)
function pbDungeonLightDemo(game) {
    this.game = game;
    console.log("pbDungeonLightDemo c'tor entry");

    this.rttTexture = null;
    this.rttFramebuffer = null;
    this.rttRenderbuffer = null;

    //this.phaserRender = this.game.renderer;
    this.phaserRender = new PIXI.WebGLRenderer()
    debugger;
    this.phaserRender.create('webgl', this.create, this.update, this);
    this.multiLightBgShaderJSON = pbPhaserRender.loader.loadFile("../json/multiLightBgSources.json");
    this.levelData = pbPhaserRender.loader.loadFile("../img/tiles/dungeon.json");
    this.tileImg = pbPhaserRender.loader.loadImage("tiles", "../img/tiles/gridtiles.png");
    pbPhaserRender.loader.loadImage("wizard", "../img/wiz.png", 32, 32, 30, 4);
    this.floorImg = pbPhaserRender.loader.loadImage("floor", "../img/dungeon__floor_2.jpg");

    console.log("pbDungeonLightDemo c'tor exit");
}


pbDungeonLightDemo.prototype.create = function () {
    console.log("pbDungeonLightDemo.create");

    // add the shader
    var jsonString = pbPhaserRender.loader.getFile(this.multiLightBgShaderJSON).responseText;
    this.multiLightBgShaderProgram = pbPhaserRender.renderer.graphics.shaders.addJSON(jsonString);

    var tileMapJSON = pbPhaserRender.loader.getFile(this.levelData).responseText;

    // Tile Map data format:
    //
    // width: number
    // height: number
    // layers: array
    //		object:
    //			name: string ("Tile Layer 1")
    //			type: string ("tilelayer")
    //			x: number
    //			y: number
    //			width: number
    //			height: number
    //			opacity: number
    //			visible: boolean
    //	 		data: array
    // tilesets: array
    //		object:
    //			name: string ("tiles-1")
    //			firstgid: number
    //			image: string ("tiles-1.png")
    //			imagewidth: number
    //			imageheight: number
    //			margin: number
    //			spacing: number
    //			tilewidth: number
    //			tileheight: number
    //			properties: object
    // tilewidth: number (duplicate of tilesets object 'tilewidth')
    // tileheight: number (duplicate of tilesets object 'tileheight')
    // orientation: string ("orthogonal")
    // properties: object
    // version: number
    this.tileMap = JSON.parse(tileMapJSON);
    this.createSurfaces();

    // create the render-to-texture, depth buffer, and a frame buffer to hold them
    this.rttTextureNumber = 1;
    this.rttTexture = pbWebGlTextures.initTexture(this.rttTextureNumber, pbPhaserRender.width, pbPhaserRender.height);
    this.rttFramebuffer = pbWebGlTextures.useFramebufferRenderbuffer(this.rttTexture);

    // create the filter destination texture and framebuffer
    this.filterTextureNumber = 2;
    this.filterTexture = pbWebGlTextures.initTexture(this.filterTextureNumber, pbPhaserRender.width, pbPhaserRender.height);
    this.filterFramebuffer = pbWebGlTextures.initFramebuffer(this.filterTexture, null);

    // set up the renderer postUpdate callback to apply the filter and draw the result on the display
    pbPhaserRender.renderer.postUpdate = this.postUpdate;

    // create a top layer that doesn't cast shadows
    this.topLayer = new layerClass();
    this.topLayer.create(rootLayer, this.phaserRender, 0, 0, 1.0, 0, 1.0, 1.0);

    this.wiz = new pbSprite();
    this.wiz.createWithKey(32, 32, "wizard", this.topLayer);
    this.wiz.z = 0;
    this.wiz.move = {x: 1000, y: 1000, cellFrame: 0, dx: 0, dy: 0, speed: 50};
    this.wiz.light = {x: 0, y: 0, r: 0.0, g: 0.0, b: 10.0, range: 0.40};

    this.enemy = [];
    for (var e = 0; e < 14; e++) {
        this.enemy[e] = {
            x: 1000,
            y: 1000,
            dx: 0,
            dy: 0,
            speed: 10 + Math.floor(Math.random() * 40),
            r: 0.25 + Math.random() * 0.5,
            g: 0.25 + Math.random() * 0.5,
            b: 0.0
        };
        this.moveToRandomEmptyLocation(this.enemy[e]);
    }

    // get the ImageData for the floor
    var imageData = pbPhaserRender.loader.getFile(this.floorImg);
    // upload the floor image directly to the correct texture register on the GPU
    this.floorTextureNumber = 3;
    pbPhaserRender.renderer.graphics.textures.prepare(imageData, false, true, this.floorTextureNumber);
};


pbDungeonLightDemo.prototype.moveToRandomEmptyLocation = function (_who) {
    var w = this.tileMap.layers[0].width;
    var h = this.tileMap.layers[0].height;
    var rx, ry;
    do {
        rx = Math.floor(Math.random() * w);
        ry = Math.floor(Math.random() * h);
    } while (this.collide(rx, ry));
    _who.x = rx * 1000;
    _who.y = ry * 1000;
};


pbDungeonLightDemo.prototype.destroy = function () {
    console.log("pbDungeonLightDemo.destroy");

    if (this.phaserRender)
        this.phaserRender.destroy();
    this.phaserRender = null;

    this.rttTexture = null;
    this.rttRenderbuffer = null;
    this.rttFramebuffer = null;

    this.filterTexture = null;
    this.filterFramebuffer = null;
};


pbDungeonLightDemo.prototype.createSurfaces = function () {
    console.log("pbScrollDemo.createSurfaces");

    // set up the tiles in a pbTransformObject
    imageData = pbPhaserRender.loader.getFile(this.tileImg);
    this.tileSurface = new pbSurface();
    this.tileSurface.createGrid(this.tileMap.tilesets[0].tilewidth, this.tileMap.tilesets[0].tileheight, this.tileMap.tilesets[0].imagewidth / this.tileMap.tilesets[0].tilewidth, this.tileMap.tilesets[0].imageheight / this.tileMap.tilesets[0].tileheight, imageData);
    this.tileSurface.isNPOT = true;		// TODO: is this required?

    // create all the scrolling layers to draw from the tileSurface
    this.createLayers(this.tileSurface);
};


pbDungeonLightDemo.prototype.createLayers = function (_surface) {
    // create the scrolling layers
    this.tileLayers = [];
    this.addLayer(_surface);
};


pbDungeonLightDemo.prototype.addLayer = function (_surface) {
    var layer = new layerClass();
    layer.create(rootLayer, this.phaserRender, 0, 0, 1, 0, 1, 1);
    rootLayer.addChild(layer);

    var i = this.tileLayers.length;
    // draw map tiles into the new layer
    this.drawMap(layer);
    this.tileLayers.push(layer);
};


pbDungeonLightDemo.prototype.drawMap = function (_layer) {
    // pre-calc pixel dimensions of map
    this.mapWidth = this.tileMap.layers[0].width * this.tileMap.tilesets[0].tilewidth;
    this.mapHeight = this.tileMap.layers[0].height * this.tileMap.tilesets[0].tileheight;

    this.mapSprites = [];
    for (var y = 0; y < this.tileMap.layers[0].height; y++) {
        this.mapSprites[y] = [];
        for (var x = 0; x < this.tileMap.layers[0].width; x++) {
            var tile = this.tileMap.layers[0].data[x + y * this.tileMap.layers[0].width];

            // 0 tile number is empty space, all other tile numbers are +1 their actual index position in the tile texture
            if (tile !== 0) {
                var s = this.createTile(x * this.tileMap.tilesets[0].tilewidth, y * this.tileMap.tilesets[0].tileheight, tile - 1);
                _layer.addChild(s);
                this.mapSprites[y][x] = s;
            }
        }
    }
};


pbDungeonLightDemo.prototype.createTile = function (_x, _y, _cell) {
    var img = new imageClass();
    img.create(this.tileSurface, _cell, 0, 0, false, false);
    var spr = new pbTransformObject();
    spr.create(img, _x, _y, 0.5, 0, 1, 1);
    return spr;
};


pbDungeonLightDemo.prototype.restart = function () {
    console.log("pbDungeonLightDemo.restart");

    this.destroy();
    this.create();
};


pbDungeonLightDemo.prototype.addSprites = function () {
    console.log("pbDungeonLightDemo.addSprites");

};


pbDungeonLightDemo.prototype.collide = function (_x, _y) {
    var tile = this.tileMap.layers[0].data[_x + _y * this.tileMap.layers[0].width];
    return (tile !== 0);
};


pbDungeonLightDemo.prototype.dirChoose = function (_who, _dir) {
    if (_who.x % 1000 !== 0 || _who.y % 1000 !== 0)
        return;

    var wx = _who.x / 1000;
    var wy = _who.y / 1000;
    do {
        // pick a direction at random (0 = right, 1 = left, 2 = down, 3 = up)
        var d = Math.floor(Math.random() * 4);
        // decrease chance of reversing direction
        if (_dir !== undefined) {
            var reverse = [1, 0, 3, 2];
            if (d === reverse[_dir])
                d = Math.floor(Math.random() * 4);
            if (d === reverse[_dir])
                d = Math.floor(Math.random() * 4);
            if (d === reverse[_dir])
                d = Math.floor(Math.random() * 4);
        }
        switch (d) {
            case 0:
                if (!this.collide(wx + 1, wy)) {
                    _who.dx = _who.speed;
                    _who.dy = 0;
                    return;
                }
                break;
            case 1:
                if (!this.collide(wx - 1, wy)) {
                    _who.dx = -_who.speed;
                    _who.dy = 0;
                    return;
                }
                break;
            case 2:
                if (!this.collide(wx, wy + 1)) {
                    _who.dx = 0;
                    _who.dy = _who.speed;
                    return;
                }
                break;
            case 3:
                if (!this.collide(wx, wy - 1)) {
                    _who.dx = 0;
                    _who.dy = -_who.speed;
                    return;
                }
                break;
        }
    } while (true);
};


function fract(_value) {
    return _value % 1000;
}


pbDungeonLightDemo.prototype.wizWalk = function () {
    var wx = Math.floor(this.wiz.move.x / 1000);
    var wy = Math.floor(this.wiz.move.y / 1000);

    // sometimes we just turn
    if (Math.random() < 0.25)
        this.dirChoose(this.wiz.move, [0, 1, 2, 3][this.wiz.move.dx > 0 ? 0 : this.wiz.move.dx < 0 ? 1 : this.wiz.move.dy > 0 ? 2 : 3]);

    if (this.wiz.move.dx > 0) {
        if (this.wiz.move.dx >= 1000 - fract(this.wiz.move.x) && this.collide(wx + 2, wy)) {
            this.wiz.move.x = (wx + 1) * 1000;
            this.dirChoose(this.wiz.move, 0);
        }
    }
    if (this.wiz.move.dx < 0) {
        if (this.wiz.move.dx < -fract(this.wiz.move.x) && this.collide(wx - 1, wy)) {
            this.wiz.move.x -= this.wiz.move.x % 1000;
            this.dirChoose(this.wiz.move, 1);
        }
    }
    if (this.wiz.move.dy > 0) {
        if (this.wiz.move.dy >= 1000 - fract(this.wiz.move.y) && this.collide(wx, wy + 2)) {
            this.wiz.move.y = (wy + 1) * 1000;
            this.dirChoose(this.wiz.move, 2);
        }
    }
    if (this.wiz.move.dy < 0) {
        if (this.wiz.move.dy < -fract(this.wiz.move.y) && this.collide(wx, wy - 1)) {
            this.wiz.move.y -= this.wiz.move.y % 1000;
            this.dirChoose(this.wiz.move, 3);
        }
    }

    this.wiz.move.x += this.wiz.move.dx;
    this.wiz.move.y += this.wiz.move.dy;

    // update wizard sprite
    this.wiz.x = (this.wiz.move.x / 1000) * this.tileMap.tilesets[0].tilewidth;
    this.wiz.y = (this.wiz.move.y / 1000) * this.tileMap.tilesets[0].tileheight;

    this.wiz.move.cellFrame += 1;
    if (this.wiz.move.cellFrame >= 30)
        this.wiz.move.cellFrame = 0;
    if (this.wiz.move.dx > 0)
        this.wiz.cellFrame = this.wiz.move.cellFrame + 90;
    else if (this.wiz.move.dx < 0)
        this.wiz.cellFrame = this.wiz.move.cellFrame + 30;
    else if (this.wiz.move.dy > 0)
        this.wiz.cellFrame = this.wiz.move.cellFrame + 0;
    else if (this.wiz.move.dy < 0)
        this.wiz.cellFrame = this.wiz.move.cellFrame + 60;
};


pbDungeonLightDemo.prototype.enemyWalk = function () {
    for (var e = 0, l = this.enemy.length; e < l; e++) {
        var wx = Math.floor(this.enemy[e].x / 1000);
        var wy = Math.floor(this.enemy[e].y / 1000);

        // sometimes we just turn
        if (Math.random() < 0.1)
            this.dirChoose(this.enemy[e]);

        if (this.enemy[e].dx > 0) {
            if (this.enemy[e].dx >= 1000 - fract(this.enemy[e].x) && this.collide(wx + 2, wy)) {
                this.enemy[e].x = (wx + 1) * 1000;
                this.dirChoose(this.enemy[e], 0);
            }
        }
        if (this.enemy[e].dx < 0) {
            if (this.enemy[e].dx < -fract(this.enemy[e].x) && this.collide(wx - 1, wy)) {
                this.enemy[e].x -= this.enemy[e].x % 1000;
                this.dirChoose(this.enemy[e], 1);
            }
        }
        if (this.enemy[e].dy > 0) {
            if (this.enemy[e].dy >= 1000 - fract(this.enemy[e].y) && this.collide(wx, wy + 2)) {
                this.enemy[e].y = (wy + 1) * 1000;
                this.dirChoose(this.enemy[e], 2);
            }
        }
        if (this.enemy[e].dy < 0) {
            if (this.enemy[e].dy < -fract(this.enemy[e].y) && this.collide(wx, wy - 1)) {
                this.enemy[e].y -= this.enemy[e].y % 1000;
                this.dirChoose(this.enemy[e], 3);
            }
        }

        this.enemy[e].x += this.enemy[e].dx;
        this.enemy[e].y += this.enemy[e].dy;
    }
};


pbDungeonLightDemo.prototype.update = function () {
    this.wizWalk();
    this.enemyWalk();
};


/**
 * postUpdate - apply the filter to the rttTexture, then draw the results on screen
 *
 */
pbDungeonLightDemo.prototype.postUpdate = function () {
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    // copy the rttTexture to the filterFramebuffer attached texture, applying a shader as it draws
    gl.activeTexture(gl.TEXTURE0 + this.rttTextureNumber);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.filterFramebuffer);
    pbPhaserRender.renderer.graphics.applyShaderToTexture(this.rttTexture, this.setShader, this);

    // update transforms and draw sprites that are not shadow casters
    this.topLayer.update();

    // draw the filter texture to the display
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.activeTexture(gl.TEXTURE0 + this.filterTextureNumber);
    pbPhaserRender.renderer.graphics.drawTextureToDisplay(this.filterTexture);
};


var lightData = [
// x, y, power/color, range
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
    0.0, 0.0, 0.0, 0.0,
];


// pack bytes _r, _g and _b into a single float with four precision bits each
function pack(_r, _g, _b) {
    return (Math.floor(_r * 16.0) + Math.floor(_g * 16.0) * 256.0 + Math.floor(_b * 16.0) * 256.0 * 256.0);
}


pbDungeonLightDemo.prototype.setLightData = function () {
    // first light is attached to the player ship
    var w = this.tileMap.tilesets[0].tilewidth;
    var h = this.tileMap.tilesets[0].tileheight;
    lightData[0 * 4 + 0] = (this.wiz.move.x / 1000 * w + w * 0.5 + this.wiz.light.x) / pbPhaserRender.width;
    lightData[0 * 4 + 1] = 1.0 - (this.wiz.move.y / 1000 * h + h * 0.5 + this.wiz.light.y) / pbPhaserRender.height;
    lightData[0 * 4 + 2] = pack(this.wiz.light.r, this.wiz.light.g, this.wiz.light.b);
    lightData[0 * 4 + 3] = this.wiz.light.range;

    var i = 1;
    for (var e = 0, l = this.enemy.length; e < l; e++) {
        lightData[i * 4 + 0] = (this.enemy[e].x / 1000 * w + w * 0.5) / pbPhaserRender.width;
        lightData[i * 4 + 1] = 1.0 - (this.enemy[e].y / 1000 * h + h * 0.5) / pbPhaserRender.height;
        lightData[i * 4 + 2] = pack(this.enemy[e].r, this.enemy[e].g, this.enemy[e].b);
        lightData[i * 4 + 3] = 0.25;
        if (++i >= 16) break;
    }
    for (; i < 16; i++) {
        // a light with power/colour of zero is switched off
        lightData[i] = 0.0;
    }
};


// callback required to set the correct shader program and it's associated attributes and/or uniforms
pbDungeonLightDemo.prototype.setShader = function (_shaders, _textureNumber) {
    // set the shader program
    _shaders.setProgram(this.multiLightBgShaderProgram, _textureNumber);

    // set the secondary source texture for the shader - draws the floors using the ImageData in register # this.floorTextureNumber
    gl.uniform1i(_shaders.getSampler("uFloorSampler"), this.floorTextureNumber);

    // set the parameters for the shader program
    this.setLightData();

    // send them to the shader
    gl.uniform4fv(_shaders.getUniform("uLights"), lightData);
};

export default pbDungeonLightDemo;