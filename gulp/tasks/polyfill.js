/**
 * Gulp - Pollyfill
 * -------------
 */

// javascript polyfills compilation
// this can be adjusted per project spec
var config = require('../config');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var util = require('gulp-util');
var gulpif = require('gulp-if');

module.exports = function() {

    var doUglify = util.env.ugly ? true : false

    gulp.src([

            // html5 shiv
            config.paths.bower + '/html5shiv/html5shiv.js',

            // matchMedia polyfill
            config.paths.bower + '/matchmedia/matchmedia.js',

            // media query polyfill
            config.paths.bower + '/respond/dest/respond.min.js'
        ])
        .pipe(gulpif(doUglify, uglify()))
        .pipe(concat('polyfill.js'))
        .pipe(gulp.dest(config.paths.dist + '/js/'))

}
