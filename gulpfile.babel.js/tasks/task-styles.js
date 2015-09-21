let throughPipes = require('through-pipes');

export default function (gulp, $, config) {
    let dirs = config.dirs;
    let globs = config.globs;

    let compileMinify = () => (throughPipes((readable) => (readable
            .pipe($.sourcemaps.init())
            .pipe($.if('*.scss', $.sass().on('error', $.sass.logError)))
            .pipe($.minifyCss())
            .pipe($.sourcemaps.write())
    )));

    gulp.task('styles:local', () => {
        return gulp.src(globs.styles.local)
            .pipe(compileMinify())
            .pipe($.concat('style.min.css'))
            .pipe(gulp.dest(`${dirs.dist}/css`))
    });

    gulp.task('styles:vendor', () => {
        let glob = [].concat(globs.styles.extension, globs.styles.vendor);
        return gulp.src(glob)
            .pipe($.expectFile({reportUnexpected: false}, globs.styles.vendor))
            .pipe(compileMinify())
            .pipe($.concat('vendor.min.css'))
            .pipe(gulp.dest(`${dirs.dist}/css`))
    });

    gulp.task('styles', ['styles:local', 'styles:vendor']);
}