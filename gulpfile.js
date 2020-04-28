const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');

gulp.task('pug', () => {
  return gulp
    .src('source/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', () => {
    return del(['./dist']);
});

gulp.task('babel', () =>
    gulp.src('source/js/app.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // .pipe(uglify())
        .pipe(rename(function (path) {
            return {
                dirname: path.dirname,
                basename: path.basename + '.min',
                extname: '.js'
            };
        }))
        .pipe(gulp.dest('dist/js'))
);

gulp.task('minifyHtml', () =>
    gulp.src('source/*.html')
        // .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'))
);

gulp.task('sass', () => {
    return gulp
      .src('./source/scss/*.scss')
      .pipe(sass().on('error', sass.logError))
    //   .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', () => {
    browserSync.init({
      server: {
        baseDir: './dist',
      },
    });
    gulp.watch('./source/*.html', gulp.series('minifyHtml'));
    gulp.watch('./source/**/*.scss', gulp.series('sass'));
});


gulp.task('default', gulp.series('clean','minifyHtml', 'sass', 'babel', 'pug','watch'));