export default function (gulp, $, config, helpers) {
    let dirs = config.dirs;
    let globs = config.globs;

    gulp.task('copy:html', () => {
        return gulp.src(globs.src.html)
            .pipe(gulp.dest(`${dirs.dist}`))
    });

    gulp.task('copy', ['copy:html']);
}