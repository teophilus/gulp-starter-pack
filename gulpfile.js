var gulp       = require('gulp'),
	less       = require('gulp-less'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify     = require('gulp-uglify'),
	gutil      = require('gulp-util'),
	jshint     = require('gulp-jshint'),
	usemin     = require('gulp-usemin'),
	minifyCss  = require('gulp-minify-css'),
	rev        = require('gulp-rev');

/* Development Tasks */

/* 'less' compiles .less to .css and generates sourcemaps  */
gulp.task('less', function() {
	gulp.src('app/styles/less/*.less')
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write('sourcemaps'))
		.pipe(gulp.dest('app/styles'))
});

/* 'hint' warns via stdout js syntax errors */
gulp.task('hint', function() {
	gulp.src('app/scripts/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default', { verbose: true }));
});

/* 'watch' watches for file changes and executes respective tasks */

gulp.task('watch', function() {
	gulp.watch('app/styles/less/*.less', ['less']);
	gulp.watch('app/scripts/*.js', ['hint'])
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
		.pipe(gulp.dest('dist/'));
});

gulp.task('watcher', ['less', 'hint', 'watch' ] );
gulp.task('deploy', ['usemin'] );