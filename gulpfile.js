

// TASKS
// ------
// `gulp`: watch, compile styles, scripts and pug for development, browsersync
// 'gulp build', compile styles, scripts, and pug for production


// PLUGINS
// --------
var autoprefixer = require('gulp-autoprefixer'),
	browserify = require('browserify'),
    browserSync = require('browser-sync').create(),
    cssnano = require('gulp-cssnano'),
    gulp = require('gulp'),
    notify = require('gulp-notify'),
    rename = require('gulp-rename'),
    p = require('./package.json'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    sourcestream = require('vinyl-source-stream');


// VARIABLES
// ----------
var dist = 'dist/',
    source = 'src/';


// ERROR HANDLING
// ---------------
function handleError() {
    this.emit('end');
}

// BUILD SUBTASKS
// ---------------

// Compile SCSS
gulp.task('styles', function() {
    return gulp.src([
        source+'scss/style.scss'
    ])
    .pipe(sass({includePaths: ['node_modules']}))
        .on('error', handleError)
        .on('error', notify.onError())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
    .pipe(cssnano())
    .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(gulp.dest(dist+'css/'))
    .pipe(browserSync.stream());
});

// Bundle Javascript
gulp.task('scripts', function() {
	return browserify(source+'js/main.js')
	.bundle()
	.pipe(sourcestream('scripts.js'))
	.pipe(gulp.dest(dist+'js/'))
	.pipe(browserSync.stream());
});

// Compile Pug
gulp.task('pug',function() {
    return gulp.src(source+'pug/**/index.pug')
    .pipe(pug({
        doctype: 'html',
        basedir: source,
        pretty: true
    }))
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream());
});

// Copy Images & Fonts
gulp.task('copy', function() {
    gulp.src([source+'img/**/*'])
    .pipe(gulp.dest(dist+'img'));

    gulp.src([source+'fonts/**/*'])
    .pipe(gulp.dest(dist+'fonts'))
    .pipe(browserSync.stream());
});

// BUILD TASKS
// ------------

gulp.task('default', function() {

    gulp.start('styles', 'scripts', 'pug', 'copy');

    browserSync.init({
        server: {
            baseDir: "./dist/"
        }
    });

    // Watch scss files
    gulp.watch(source+'scss/**/*.scss', ['styles']);

    // Watch js files
    gulp.watch(source+'js/**/*.js', ['scripts']);

    // Watch pug files
    gulp.watch(source+'pug/**/*.pug', ['pug']);
    gulp.watch(source+'commons/**/*.pug', ['pug']);

    // Watch images directory
    gulp.watch(source+'img/**/*', ['copy']);

});

gulp.task('build', function() {

    gulp.start('styles', 'scripts', 'pug', 'copy');

});
