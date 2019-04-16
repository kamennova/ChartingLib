var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-csso');
var concatCss = require('gulp-concat-css');
var server = require('gulp-server-livereload');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

gulp.task('css', function(){
    return gulp.src('css/*.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(concatCss('appv1.css'))
        .pipe(gulp.dest('build'))
});

gulp.task('js', function(){
    return gulp.src('js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build'))
});

gulp.task('chart_js', function(){
    return gulp.src('chart_js/*.js')
        .pipe(concat('chart_js.js'))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build'))
});

gulp.task('watch', function() {
    gulp.watch('css/*.[less|css]', ['css']);
    gulp.watch('js/*.js', ['js']);
    gulp.watch('chart_js/*.js', ['chart_js']);
});