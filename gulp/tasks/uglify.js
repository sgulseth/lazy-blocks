module.exports = function() {
    var gulp = require('gulp'),
        uglify = require('gulp-uglify');

    gulp.task('uglify', function() {
      gulp.src('./src/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
    });
};
