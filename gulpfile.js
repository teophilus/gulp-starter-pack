var gulp       = require('gulp'),
	less       = require('gulp-less'),
	sass       = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify     = require('gulp-uglify'),
	gutil      = require('gulp-util'),
	jshint     = require('gulp-jshint'),
	usemin     = require('gulp-usemin'),
	minifyCss  = require('gulp-minify-css'),
	rev        = require('gulp-rev');

/* Paths */

var config = require('./gulp-config.json');

/* Development Tasks */

/* 'less' compiles .less to .css and generates sourcemaps  */
gulp.task('less', function() {
	gulp.src(config.paths.lessFiles)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write('sourcemaps'))
		.pipe(gulp.dest(config.paths.stylesOutput))
});

/* 'sass' compiles .scss .scss to .css and generates sourcemaps  */
gulp.task('sass', function () {
	gulp.src(config.paths.scssFiles)
		.pipe(sass())
		.pipe(sourcemaps.write('sourcemaps'))
		.pipe(gulp.dest(config.paths.stylesOutput))
});

/* 'hint' warns via stdout js syntax errors */
gulp.task('hint', function() {
	gulp.src(config.paths.jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default', { verbose: true }));
});

/* 'watch' watches for file changes and executes respective tasks */
gulp.task('watch', function() {
	gulp.watch(config.paths.lessFiles, ['less']);
	gulp.watch(config.paths.jsFiles, ['hint'])
});

/* Deploy Tasks */

/* 'usemin' looks at 'html' files for the doc blocks to concatenate css & js,
uglify js, adds hashes to js & css to bypass caches */ 
gulp.task('usemin', function () {
	gulp.src('app/*.html')
		.pipe(usemin({
			css: [minifyCss(), 'concat', rev()],
			js: [uglify(), rev()]
		}))
		.pipe(gulp.dest(config.paths.distFolder));
});

gulp.task('watcher', ['less', 'sass', 'hint', 'watch' ] );
gulp.task('deploy', ['usemin'] );