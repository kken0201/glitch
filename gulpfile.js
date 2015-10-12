var gulp = require('gulp'),
  $ = require("gulp-load-plugins")(),
  runSequence = require('run-sequence'),
  nib = require('nib'),
  stylus = require('gulp-stylus'),
  browserSync = require('browser-sync'),
  browserify = require('browserify'),
  babelify = require('babelify'),
  source = require('vinyl-source-stream');

var dir = {
  src: 'src',
  dist: 'dist'
};

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: dir.dist
    }
  });
});

gulp.task('browserify', function() {
  browserify(dir.src + '/js/app.js', { debug: true })
    .transform(babelify)
    .bundle()
    .on("error", function (err) { console.log("Error : " + err.message); })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(dir.dist))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('stylus', function() {
  return gulp.src([dir.src + '/{,**/}*.styl', '!src/assets/stylesheets/{,**/}_*.styl'])
    .pipe($.plumber({
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    }))
    .pipe($.stylus({
      use: nib(),
      compress: false
    }))
    .pipe(gulp.dest(dir.dist + '/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('jade', function() {
  gulp.src([dir.src + '/{,**/}*.jade', '!src/partial/{,**/}_*.jade'])
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true
    }))
    .pipe(gulp.dest(dir.dist))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', function() {
  gulp.watch([
    dir.src + '/{,**/}*.styl'
  ], ['stylus']);

  gulp.watch([
    dir.src + '/{,**/}*.jade'
  ], ['jade']);

  gulp.watch([
    dir.src + '/js/{,**/}*.js'
  ], ['browserify']);

  gulp.watch([
    dir.src + '/{,**/}*.html',
    dir.src + '/{,**/}*.css'
  ], ['copy']);

});

gulp.task('imagemin', function() {
  var imgSrc = dir.src + '/{,**/}*.{png,jpg,jpeg,gif,svg}';
  return gulp.src(imgSrc)
    .pipe($.changed(imgSrc))
    .pipe($.imagemin())
    .pipe(gulp.dest(dir.dist));
});

gulp.task('copy', function() {
  return gulp.src([
      dir.src + '/{,**/}*.html',
      dir.src + '/{,**/}*.css'
    ])
    .pipe(gulp.dest(dir.dist));
});

gulp.task('default', [
  'browser-sync',
  'watch'
]);

gulp.task('build', function(callback) {
  return runSequence(
    'stylus',
    'jade',
    'browserify',
    'imagemin',
    'copy',
    callback
  );
});
