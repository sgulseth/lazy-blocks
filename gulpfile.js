var gulp = require('./gulp')([
    'uglify',
    'js-hint'
]);

gulp.task('default', ['js-hint', 'uglify']);
