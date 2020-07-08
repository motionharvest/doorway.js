const gulp = require('gulp');
const serve = require('gulp-serve');

module.exports = function () {
    gulp.task('serve', serve('build'));
}
