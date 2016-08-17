var gulp = require('gulp');
var scssLint = require('gulp-scss-lint');
var config = require('../config');

module.exports = function() {
    gulp.src([config.paths.sassSourceRoot + '/**/*.scss'])
        .pipe(scssLint({
            config: '.scss-lint.yml'
        }))
        .on('error', function() {})
}
