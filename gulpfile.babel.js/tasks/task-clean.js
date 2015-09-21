let rimraf = require('rimraf');

export default function (gulp, $, config, helpers) {
    let dirs = config.dirs;
    let globs = config.globs;

    gulp.task('clean:all', (cb) => {
        return rimraf(globs.dist.all, cb);
    });
}