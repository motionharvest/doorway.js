/**
 * Gulp - Browserify
 * -----------------
 */

// run all JS pages files through browserify, concat, uglify and save to dist
var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");

module.exports = function() {

    // handle browseirfying bundle
    var browserified = transform(function(filename) {
        var b = browserify({
            entries: filename,
            debug: true
        });
        return b.bundle();
    });

    // pipe all JS pages files through JSHint, browserify, uglify and finally save to dist
    gulp.src(['dev/doorway.js'])
        .pipe(browserified).on('error', notify.onError({
            title: 'They pay you to do this?',
            message: '<%= error.message %> ?! Is this some kind of joke?'
        }))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('../dev/maps'))
        .pipe(rename("doorway.min.js"))
        .pipe(gulp.dest('build'));

};
