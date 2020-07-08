/**
 * Gulp - Watch
 * -----------------
 */

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
   

module.exports = function() {
    gulp.watch('dev/**/*.js', ['build']);

    gulp.watch([
        'build/**/*'
    ]).on('change', reload);

    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });

}
