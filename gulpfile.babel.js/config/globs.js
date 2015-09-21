/*
 * Glob patterns
 * ============================================================================
 *
 * Information about the project assets and source code. Very specific to the
 * development tasks, telling where to read the project source code for
 * processing and compilation.
 */

'use strict';


var dirs = require('./dirs');

var globs = {
    src: [`${dirs.src}/**`]
    , index: [`${dirs.src}/index.html`]
    , assets: [`${dirs.src}/assets/**/*`]
    ,  scripts: {
        local: [`${dirs.src}/js/**/*.js`]
        , vendor: [
            //`node_modules/phaser/build/custom/phaser-no-physics.js`
            //`node_modules/phaser/dist/phaser.js`
            `node_modules/angular-material/angular-material.min.js`
        ]
    }
    , styles: {
        local: [`${dirs.src}/css/**/*.{css,scss}`]
        , extension: []
        , vendor: [`node_modules/angular-material/angular-material.min.css`]
    }
    , dist: {
        all: `${dirs.dist}/**/*`
    }
};

module.exports = globs;
