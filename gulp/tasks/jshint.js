var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var stylish = require('gulp-jscs-stylish');
var config = require('../config');

module.exports = function() {
    gulp.src([config.paths.src + '/js/**/*.js'])
        .pipe(jshint())
        .pipe(jscs())
        .on('error', function() {})
        .pipe(stylish.combineWithHintResults())
        .pipe(jshint.reporter('jshint-stylish'));
}
