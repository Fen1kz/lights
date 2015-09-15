export default function (gulp, $, config) {
    let dirs = config.dirs;
    let globs = config.globs;

    gulp.task('glob', () =>
        gulp.src(globs.src.style.vendor)
            .pipe($.tap((file) => console.log(file.path))));

    gulp.task('build', ['copy', 'scripts:local']);

    gulp.task('dist', $.sequence('clean:all', 'build'));

    gulp.task('liverelaod', function () {
        $.livereload.listen(function (err) {
            if (err) return console.log(err);
        });
    });

    gulp.task('watch', ['dist'], () => {
        $.livereload.listen();
        gulp.watch([globs.src.all], ['build']).on('change', function(){
            $.livereload.changed();
        });
    });
}