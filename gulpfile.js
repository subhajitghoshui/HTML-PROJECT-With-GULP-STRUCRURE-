//SG-18

var gulp = require('gulp');

var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var htmlmin = require('gulp-htmlmin');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');
// var basemaps = require('gulp-sourcemaps');
var cache = require('gulp-cache');
var flatten = require('gulp-flatten');
var clean = require('gulp-clean');


var paths = {
    css: ['base/scss/**/*.css'],
    sass: ['base/scss/**/*.scss'],
    others: ['base/*.{ico,htaccess}'],
    html: 'base/*.html',
    pages: 'base/pages/**/*.{html,js,css,min.js,min.css,gif,jpg,png,svg,ico,pdf,eot,svg,ttf,woff,woff2}',
    libs: [],
    custom: [
        'base/js/**/*.js',
        'base/js/custom.js'
    ],
    assets: {
        images: ['base/images/*.{gif,jpg,png,svg,ico,pdf}', 'base/images/**/*.{gif,jpg,png,svg,ico,pdf}'],
        fonts: ['base/fonts/**/*.{eot,svg,ttf,woff,woff2}']
    },
    build: 'www'
}


gulp.task('connect', function () {
    connect.server({
        root: 'www',
        livereload: true,
        // host: '192.168.1.106',
        port: 1111
    });
});

gulp.task('html', function () {
    gulp.src(paths.html)
        //HTML MINIFY 
        .pipe(htmlmin({
            collapseWhitespace: true
        }))//HTML MINIFY /-End
        .pipe(gulp.dest(paths.build))
        .pipe(connect.reload());
});

gulp.task('pages', function () {
    gulp.src(paths.pages)
        //HTML MINIFY 
        .pipe(htmlmin({
            collapseWhitespace: true
        }))//HTML MINIFY /-End
        .pipe(gulp.dest(paths.build + '/pages'))
        .pipe(connect.reload());
});


gulp.task('css', function () {
    gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest(paths.build + '/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({ keepSpecialComments: 0 }))
        .pipe(gulp.dest(paths.build + '/css'))
        .pipe(connect.reload());
});

gulp.task('copyCss', function () {
    gulp.src(paths.css)
        //.pipe(uglify())
        //.pipe(flatten())
        .pipe(gulp.dest(paths.build + '/css'))
});

gulp.task('others', function () {
    gulp.src(paths.others)
        .pipe(gulp.dest(paths.build))
        .pipe(connect.reload());
});

gulp.task('libs', function () {
    gulp.src(paths.libs)
        .pipe(concat('js/libs.js'))
        .pipe(cache.clear())
        .pipe(gulp.dest(paths.build))
        .pipe(uglify())
        .pipe(flatten())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.build + "/js"))
        .pipe(connect.reload());
});


gulp.task('js', function () {
    return gulp.src(paths.custom)
        //.pipe(concat('js/custom.js'))
        .pipe(cache.clear())
        .pipe(gulp.dest(paths.build + "/js"))
        .pipe(uglify())
        .pipe(flatten())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.build + "/js"))
        .pipe(connect.reload());
});

gulp.task('imgs', function () {
    gulp
        .src(paths.assets.images)
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{ removeViewBox: true }]
        })))
        //.pipe(flatten({ includeParents: 1}))
        .pipe(gulp.dest(paths.build + "/images"));
});

gulp.task('fonts', function () {
    gulp
        .src(paths.assets.fonts)
        .pipe(cache.clear())
        //.pipe(flatten())
        .pipe(gulp.dest(paths.build + "/fonts"));
});


gulp.task('clean', function () {
    return gulp.src(paths.build, { read: false })
        .pipe(clean());
});

gulp.task('default', ['connect', 'copyCss', 'css', 'others', 'html', 'pages', 'libs', 'fonts', 'js', 'imgs'], function (cb) {
    gulp.watch(paths.sass, ['css']),
    gulp.watch(paths.css, ['copyCss']),
    gulp.watch(paths.others, ['others']),
    gulp.watch(paths.html, ['html']),
    gulp.watch(paths.pages, ['pages']),
    gulp.watch(paths.libs, ['libs']),
    gulp.watch(paths.custom, ['js']),
    gulp.watch(paths.assets.images, ['imgs']),
    gulp.watch(paths.assets.fonts, ['fonts'])
});
