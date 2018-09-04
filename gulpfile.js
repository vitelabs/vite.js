const gulp = require('gulp');
// const rename = require('gulp-rename');
// const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
// const streamify = require('gulp-streamify');
const babelify = require('babelify');
const exorcist = require('exorcist');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const path = require('path');

const BUILD_PATH = path.join(__dirname, 'static/');
const ENTRY_PATH = path.join(__dirname, 'index.js');
const APP_NAME = 'vite';

const version = require('./src/version.json');
const browserifyOptions = {
    entries: ENTRY_PATH,
    debug: true,
    bundleExternal: true
};

// Replace version in 'package.json', avoid being inconsistent with version in 'src/config/version'.
gulp.task('version', function () {
    console.log(`sync version: ${version.ViteJS}`);
    return gulp.src(['./package.json'])
        .pipe(replace(/\"version\"\: \"([\.0-9]*)\"/, '"version": "' + version.ViteJS + '"'))
        .pipe(gulp.dest('./'));
});

// [TODO] Not building a lightweight package, now. Maybe support in future.
gulp.task('build', function () {
    console.log('standard build');
    return browserify(browserifyOptions)
        .require(ENTRY_PATH, { expose: 'ViteJS' })
        .transform(babelify, { 'presets': ['es2015'] })
        .bundle()
        .pipe(exorcist(path.join(BUILD_PATH, APP_NAME + '.js.map')))
        .pipe(source(APP_NAME + '.js'))
        .pipe(gulp.dest(BUILD_PATH));
    // .pipe(streamify(uglify()))
    // .pipe(rename(APP_NAME + '.min.js'))
    // .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('default', ['version', 'build'], function (done) {
    done();
});