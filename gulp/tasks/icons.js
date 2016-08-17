var config = require('../config');
var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var fontName = 'ds-icons';

module.exports = function() {

    gulp.src([config.paths.images + '/icons/*.svg'])
        .pipe(iconfontCss({
            fontName: fontName,
            path: config.paths.src + '/scss/templates/_icons.scss',
            targetPath: '../../src/scss/components/_icons.scss',
            fontPath: '../../../fonts/icons/'
        }))
        .pipe(iconfont({
            fontName: fontName,
            normalize: true
        }))
        .pipe(gulp.dest(config.paths.fonts + '/icons'));
}
