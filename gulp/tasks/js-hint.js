module.exports = function() {
    var jshint = require('gulp-jshint'),
        gulp   = require('gulp');

    gulp.task('js-hint', function() {
        gulp.src('./lib/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
    });
}