export default function (gulp, $, config, helpers) {
    let dirs = config.dirs;
    let globs = config.globs;

    gulp.task('copy:index', () => {
        return gulp.src(globs.index)
            .pipe(gulp.dest(`${dirs.dist}`))
    });

    gulp.task('copy', ['copy:index']);
}