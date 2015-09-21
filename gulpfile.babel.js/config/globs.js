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
    all: [`${dirs.src}/**`]
    , index: [`${dirs.src}/index.html`]
    ,  scripts: {
        local: [`${dirs.src}/root/css/**/*.js`]
        , vendor: []
    }
    , styles: {
        local: []
        , extension: []
        , vendor: []
    }
    , dist: {
        all: `${dirs.dist}/**/*`
    }
};

module.exports = globs;
