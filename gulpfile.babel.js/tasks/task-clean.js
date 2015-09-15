let rimraf = require('rimraf');

export default function (gulp, $, config, helpers) {
    let dirs = config.dirs;
    let globs = config.globs;

    gulp.task('clean:all', (cb) => {
        return rimraf(globs.dist.all, cb);
    });

    //gulp.task('clean:localcontent', (cb) => {
    //    return rimraf(globs.dist.content, cb);
    //});

    //gulp.task('dist:clean:projects', (cb) => {
    //    return rimraf(globs.dist.projects, cb);
    //});
}