var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var streamify = require('gulp-streamify');
var babelify = require('babelify');
var exorcist = require('exorcist');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var path = require('path');

const BUILD_PATH = path.join(__dirname, 'static/');
const ENTRY_PATH = path.join(__dirname, 'index.js');
const APP_NAME = 'vite';

const version = require('./lib/config/version.json');
const browserifyOptions = {
    entries: ENTRY_PATH,
    debug: true,
    bundleExternal: false
};

// 替换package的version: 避免与代码逻辑中version不统一
gulp.task('version', function () {
    console.log(`同步 version 为: ${version.viteJSVersion}`);
    return gulp.src(['./package.json'])
        .pipe(replace(/\"version\"\: \"([\.0-9]*)\"/, '"version": "' + version.viteJSVersion + '"'))
        .pipe(gulp.dest('./'));
});

// [TODO] 构建任务现阶段不区分轻量级打包。后续可能需要支持
gulp.task('build', function (cb) {
    console.log('标准构建');
    return browserify(browserifyOptions)
        .require(ENTRY_PATH, { expose: 'viteJS' })
        .require('bignumber.js')
        .transform(babelify, { 'presets': ['es2015'] })
        .bundle()
        .pipe(exorcist(path.join(BUILD_PATH, APP_NAME + '.js.map')))
        .pipe(source(APP_NAME + '.js'))
        .pipe(gulp.dest(BUILD_PATH))
        .pipe(streamify(uglify()))
        .pipe(rename(APP_NAME + '.min.js'))
        .pipe(gulp.dest(BUILD_PATH));
});

gulp.task('default', ['version', 'build'], function (done) {
    done();
});