const gulp = require('gulp');
const del = require('del');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// gulp.task('clean', () =>{
//     (async () => {
//     const deletedPaths = await del(['temp/*.js', '!temp/unicorn.js']);
 
//     console.log('Deleted files and directories:\n', deletedPaths.join('\n'));
// })();
// });

gulp.task('clean', () => {
    return del(['./dist']);
});

gulp.task('babel', () =>
    gulp.src('source/js/app.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
);

gulp.task('copyHTML', () =>
    gulp.src('source/*.html')
        .pipe(gulp.dest('dist'))
);

gulp.task('default', gulp.series('clean','copyHTML', 'babel'));