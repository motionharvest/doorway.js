/**
 * Gulp - Browserify
 * -----------------
 */

// run all JS pages files through browserify, concat, uglify and save to dist
var config = require('../config');
var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var util = require('gulp-util');
var gulpif = require('gulp-if');

module.exports = function() {

    // handle browseirfying bundle
    var browserified = transform(function(filename) {
        var b = browserify({
            entries: filename,
            debug: true
        });
        return b.bundle();
    });

    //run jshint if useing --hint flag
    var useHint = util.env.hint ? true : false
 

    //check if we need to uglify
    //run uglify if useing --ugly flag
    var doUglify = util.env.ugly ? true : false

    // pipe all JS pages files through JSHint, browserify, uglify and finally save to dist
    gulp.src([config.paths.src + '/js/main.js'])
        .pipe(browserified).on('error', notify.onError({
            title: 'They pay you to do this?',
            message: '<%= error.message %> ?! Is this some kind of joke?'
        })).on('error', function(error) {
            if (process.env.IS_CI === '1') {
                console.log('CI Evn: Exiting With -1');
                process.exit(-1);
            }
        })
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(gulpif(doUglify, uglify({
            warnings: false
        })))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(config.paths.dist + '/js'));

};
