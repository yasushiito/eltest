var gulp = require('gulp');
var $ = require('gulp-babel')();

gulp.task('compile', function(){
  return gulp.src('src/**/*.{js,jsx}')
    .pipe($.babel())
    .pipe(gulp.dest('build'));
});
