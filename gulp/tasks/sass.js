/**
 * Gulp - Sass
 * -----------------
 */

// Build and
var config = require('../config');
var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var util = require('gulp-util');
var gulpif = require('gulp-if');
var crypto = require('crypto');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');

module.exports = function() {

    //store if we're requesting maps
    var useMaps = util.env.maps ? true : false

    //run jshint if useing --hint flag
    var useHint = util.env.hint ? true : false

    console.log('Building with source maps?' + useMaps);

    if (useHint) {
        gulp.run('scss-lint');
    }

    // uncomment compressed style for production
    // easier in development to leave uncompressed
    return sass(config.paths.src + '/scss', {
            //style: 'compressed',
            sourcemap: useMaps,

            // Use the md5 of the current directory as
            // the container name so we never collide with
            // another environment on the same vps
            container: crypto.createHash('md5').update(__dirname).digest('hex')
        }).on('error', notify.onError({
            title: 'You dun goofed.',
            message: '<%= error.message %> and the consequences, will never be the same!'
        })).on('error', function(error) {
            if (process.env.IS_CI === '1') {
                console.log('CI Evn: Exiting With -1');
                process.exit(-1);
            }
        })
        .pipe(gulpif(useMaps, sourcemaps.write('maps', {
            includeContent: false,
            sourceRoot: config.paths.sassSourceRoot
        })))
        .pipe(gulp.dest(config.paths.dist + '/css'));

};
