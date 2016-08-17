/**
 * Gulp - Handlebars
 * -------------
 */
var config = require('../config');
var gulp = require('gulp');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var notify = require('gulp-notify');

module.exports = function() {

    gulp.src(config.paths.src + '/js/templates/*.hbs')
        .pipe(handlebars()).on('error', notify.onError({
            title: 'Bad Handlebars. Bad.',
            message: '<%= error.message %>! How could you?'
        })).on('error', function(error) {
            if (process.env.IS_CI === '1') {
                console.log('CI Evn: Exiting With -1');
                process.exit(-1);
            }
        })
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            root: 'exports',
            noRedeclare: true

            // Avoid duplicate declarations
        }))
        .pipe(concat('templates.js'))
        .pipe(wrap('var Handlebars = require("handlebars");\n <%= contents %>'))
        .pipe(gulp.dest(config.paths.dist + '/js'));

};
