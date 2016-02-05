var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  cssnano = require('gulp-cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  inject = require('gulp-inject'),
  concat = require('gulp-concat'),
  del = require('del');


gulp.task('clean', function() {
  del.sync('dist/**/*');
});

// styles
gulp.task('styles', function() {
  return gulp.src('css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'));
});

// venders
gulp.task('vendors', function() {
  return gulp.src(['node_modules/babylonjs/babylon.js',
      'node_modules/cannon/build/cannon.min.js'
    ])
    .pipe(gulp.dest('dist/js'));
});

// scripts
gulp.task('scripts', function() {
  return gulp.src(['js/main.js',
      'js/scene.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify({
      mangle: false
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

// html & css/js injection
gulp.task('injection', ['styles', 'vendors', 'scripts'], function() {
  return gulp.src('index.html')
    .pipe(inject(gulp.src(['dist/css/**/*.css', 'dist/js/**/*.js'], {
      read: false
    }), {
      ignorePath: 'dist',
      relative: true
    }))
    .pipe(gulp.dest('dist'));
});

// build
gulp.task('build', ['clean', 'injection']);
