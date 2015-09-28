let browserify = require('browserify-incremental');
let babelify = require('babelify');
let stringify = require('stringify');
let source = require('vinyl-source-stream');

export default function (gulp, $, config) {
    let dirs = config.dirs;
    let globs = config.globs;

    let bundler = browserify(`${dirs.src}/js/app.js`, {debug: true})
        .transform(stringify(['.html', '.glsl', '.frag']))
        .transform(babelify);

    gulp.task('scripts:local', () => {
        return bundler
            .bundle()
            .on('error', function handleError(err) {
                console.error(err.toString());
                this.emit('end');
            })
            .pipe(source('bundle.js'))
            .pipe(gulp.dest(`${dirs.dist}/js`))
            .pipe($.livereload());
    });

    gulp.task('scripts:vendor', () => {
        return gulp.src(globs.scripts.vendor)
            .pipe($.expectFile(globs.scripts.vendor))
            .pipe($.concat('vendor.min.js'))
            .pipe(gulp.dest(`${dirs.dist}/js`))
    });

    gulp.task('scripts', ['scripts:local', 'scripts:vendor']);
}