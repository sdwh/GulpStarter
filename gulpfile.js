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
const concat = require('gulp-concat');
const version = require('gulp-version-number');
const parseArgs = require('minimist');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const merge = require("merge-stream");
const ejs = require("gulp-ejs");
const lodash = require("lodash");

const argv = parseArgs(process.argv.slice(2));

gulp.task('clean', () => {
    return del(['./dist']);
});


/***********************************************************
HTML
************************************************************/

gulp.task('pug', () => {
  return gulp
    .src('source/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.stream())
});

gulp.task('ejs', () => {
  return gulp.src("./source/*.ejs")
    .pipe(ejs({
        msg: "Hello Gulp!",
        boolValue: false,
        age: 29,
        lodash : lodash
    }))
    .pipe(rename(function (path) {
      return {
          dirname: path.dirname,
          basename: path.basename,
          extname: '.html'
      };
    }))
    .pipe(gulp.dest("./dist"))
    .pipe(browserSync.stream())
})

gulp.task('minifyHtml', () => 
    gulp.src('source/*.html')
        .pipe(gulpif(argv.env === 'production', htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream())
);

/***********************************************************
CSS
************************************************************/

gulp.task('sass', () => {
  return gulp
    .src('./source/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(argv.env === 'production', cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulp.dest('./dist/css'));
});

/***********************************************************
JavaScript
************************************************************/

gulp.task('babel', () =>
    gulp.src('source/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulpif(argv.env === 'production', uglify()))
        .pipe(concat('all.js'))
        .pipe(rename(function (path) {
            return {
                dirname: path.dirname,
                basename: path.basename + '.min',
                extname: '.js'
            };
        }))
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream())
);

/***********************************************************
Misc
************************************************************/

var versionConfig = {
  value: '%TS%',
  append: {
    key: 'v',
    to: ['css', 'js'],
  },
};

gulp.task('version', () => {
  return gulp.src('source/*.html')
  .pipe(version(versionConfig))
  .pipe(gulp.dest('dist'));
});

gulp.task('imagemin', () => {
  return gulp.src('assets/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
});

/***********************************************************
Vedors Management
************************************************************/

gulp.task('vendors', () => {
  return merge([
    //bulma
    gulp.src('./node_modules/bulma/css/*.css')
    .pipe(gulp.dest('./dist/vendor/bulma')),
    
    //bulma-helpers
    gulp.src('./node_modules/bulma-helpers/css/*.css')
    .pipe(gulp.dest('./dist/vendor/bulma-helpers'))
  ])
});

/***********************************************************
Build
************************************************************/

gulp.task('watch', () => {
    browserSync.init({
      server: {
        baseDir: './dist',
      },
    });
    gulp.watch('./source/*.html', gulp.series('minifyHtml'));
    gulp.watch('./source/**/*.pug', gulp.series('pug'));
    gulp.watch('./source/**/*.ejs', gulp.series('ejs'));
    gulp.watch('./source/**/*.scss', gulp.series('sass'));
});

// gulp 
// gulp pure
// gulp --env production
// gulp pure --env production

gulp.task('pure', gulp.series(
  'clean',
  'minifyHtml',
  'sass',
  'babel',
  'vendors',
  'pug',
  'ejs',
  'imagemin'
));

gulp.task('default', gulp.series(
  'pure',
  'watch'
));