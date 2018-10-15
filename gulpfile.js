const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const streamify = require('gulp-streamify');
const babelify = require('babelify');
const exorcist = require('exorcist');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const path = require('path');
const babel = require('gulp-babel');
const replace = require('gulp-replace');

// [TODO] Not building a lightweight package, now. Maybe support in future.

const BUILD_PATH = path.join(__dirname, 'ViteJS/');
const ENTRY_PATH = path.join(__dirname, 'index.js');
const APP_NAME = 'vite';

const otto_BUILD_PATH = path.join(__dirname, 'ottoDist/');
const otto_ENTRY_PATH = path.join(__dirname, 'index.js');

const version = require('./package.json').version;

console.log(`Build ViteJS: ${version}`);

const otto_browserifyOptions = {
    entries: path.join(__dirname, 'ottoEntry.js'),
    bundleExternal: true
};
const browserifyOptions = {
    entries: ENTRY_PATH,
    debug: true,
    bundleExternal: true
};
gulp.task('build-js', function () {
    console.log('standard build');
    return browserify(browserifyOptions)
        .require(ENTRY_PATH, {
            expose: 'ViteJS'
        })
        .transform('browserify-replace', {
            replace: [{
                from: /\~ViteJS.version/,
                to: version
            }]
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

gulp.task('build-otto', function () {
    console.log('standard build');
    return browserify(otto_browserifyOptions)
        .require(otto_ENTRY_PATH, {
            expose: 'ViteJS'
        })
        .transform('browserify-replace', {
            replace: [{
                from: /\~ViteJS.version/,
                to: version
            }]
        })
        .transform(babelify, {
            presets: [
                ['@babel/preset-env', {
                    'useBuiltIns': 'usage',
                    targets: {
                        browsers: ['>0.001%']
                    },
                    include: ['es6.typed.*']
                }]
            ],
            global: true
        })
        .bundle()
        .pipe(source(APP_NAME + '.js'))
        .pipe(gulp.dest(otto_BUILD_PATH))
        .pipe(streamify(uglify()))
        .pipe(rename(APP_NAME + '.min.js'))
        .pipe(gulp.dest(otto_BUILD_PATH));
});

const BUILD_ES5_PATH = path.join(BUILD_PATH, 'es5/');
gulp.task('es5-src', function () {
    return gulp.src('src/**/*.js')
        .pipe(replace(/\~ViteJS.version/, version))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(path.join(BUILD_ES5_PATH, 'src')));
});
gulp.task('es5-libs', function () {
    return gulp.src('libs/**/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest(path.join(BUILD_ES5_PATH, 'libs')));
});

gulp.task('default', ['build-js', 'es5-src', 'es5-libs'], function (done) {
    done();
});