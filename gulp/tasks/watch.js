/**
 * Gulp - Watch
 * -----------------
 */

//watch for sass/js changes and run appropriate tasks
var config = require('../config');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var util = require('gulp-util');
var gulpif = require('gulp-if');
var fs = require('fs');
var prompt = require('gulp-prompt');
var needsPrompt = false;
var filename = 'gulp/.vhost';

function _watchFiles() {
    gulp.watch(config.paths.src + '/js/**/*.js', ['browserify']);

    gulp.watch([
            config.paths.dist + '/js/**/*.js',
            config.paths.documentRoot + '/*.html'
        ])
        .on('change', reload);
}

function _startBrowserSync() {
    //read vhost file here
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) throw err;

        //start a browsersync session using the data of gulp/.vhost
        browserSync({
            proxy: data
        });
    });
}

module.exports = function() {
    //does our vhost exist
    //check if gulp/.vhost has been created
    fs.exists(filename, function(exists) {
        if (!exists) {
            //prompt
            needsPrompt = true;
            gulp.src('gulpfile.js')
                .pipe(prompt.prompt({
                    name: 'vhost',
                    message: 'Please enter your vhost name'
                }, function(res) {
                    fs.writeFile(filename, res.vhost);
                    console.log('Virtual Host Set: ' + res.vhost);
                    _startBrowserSync();
                    _watchFiles();
                }));
        } else {
            _startBrowserSync();
            _watchFiles();
        }
    });

};
