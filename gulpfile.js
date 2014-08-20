var gulp = require("gulp");
var browserify = require("gulp-browserify");
var rename = require("gulp-rename");
var gutil = require("gulp-util");

gulp.task('backgroundjs', function(){
  gulp.src('src/coffee/background/app.coffee', {read:false})
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee', '.js']
    }))
    .pipe(rename('background.js'))
    .pipe(gulp.dest('./build/js'))
    .on('error', gutil.log)
});

gulp.task('popupjs', function(){
  gulp.src('src/coffee/popup/popup.coffee', {read:false})
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee', '.js']
    }))
    .pipe(rename('popup.js'))
    .pipe(gulp.dest('./build/js'))
    .on('error', gutil.log)
});


gulp.task('watch', function(){
  gulp.watch('src/coffee/**/*', ['backgroundjs', 'popupjs']);
});

gulp.task('default',['watch']);
