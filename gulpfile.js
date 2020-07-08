const gulp = require('gulp');
const task_build = require('./gulp-tasks/build');
const task_watch = require('./gulp-tasks/watch');

gulp.task('build', task_build)
gulp.task('watch', task_watch)
//gulp.task('serve', task_serve)
gulp.task('default', ['build', 'watch'])
