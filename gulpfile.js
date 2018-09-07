const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const streamify = require('gulp-streamify');
const babelify = require('babelify');
const exorcist = require('exorcist');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const path = require('path');

const BUILD_PATH = path.join(__dirname, 'static/');
const ENTRY_PATH = path.join(__dirname, 'index.js');
const APP_NAME = 'vite';

const version = require('./package.json').version;
const browserifyOptions = {
    entries: ENTRY_PATH,
    debug: true,
    bundleExternal: true
};

console.log(`Build ViteJS: ${version}`);

// [TODO] Not building a lightweight package, now. Maybe support in future.
gulp.task('build', function () {
    console.log('standard build');
    return browserify(browserifyOptions)
        .require(ENTRY_PATH, { expose: 'ViteJS' })
        .transform('browserify-replace', {
            replace: [{ from: /\~ViteJS.version/, to: version }]
        })
        .transform(babelify)
        .bundle()
        .pipe(exorcist(path.join(BUILD_PATH, APP_NAME + '.js.map')))
        .pipe(source(APP_NAME + '.js'))
        .pipe(gulp.dest(BUILD_PATH))
        .pipe(streamify(uglify())) 
        // .on('error', function (err) { console.log(err); })
        .pipe(rename(APP_NAME + '.min.js'))
        .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('default', ['build'], function (done) {
    done();
});