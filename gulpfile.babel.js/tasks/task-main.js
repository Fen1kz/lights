export default function (gulp, $, config) {
    let dirs = config.dirs;
    let globs = config.globs;

    gulp.task('glob', () =>
        gulp.src([])
            .pipe($.tap((file) => console.log(file.path))));

    gulp.task('build', ['copy', 'scripts:local', 'styles:local']);

    gulp.task('dist', $.sequence('clean:all', ['build', 'scripts', 'styles']));

    gulp.task('watch', ['dist'], () => {
        $.livereload.listen(function (err) {
            if (err) return console.log(err);
        });
        gulp.watch([globs.src.all], ['build']).on('change', function () {
            $.livereload.changed();
        });
    });
}