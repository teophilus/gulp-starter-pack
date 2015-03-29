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

var paths = {
	lessFiles: 'app/styles/less/*.less',
	scssFiles: 'app/styles/scss/*.scss',
	jsFiles: 'app/scripts/*.js',
	scriptsOutput: 'app/scripts',
	stylesOutput: 'app/styles',
	distFolder: 'dist/'
};

/* Development Tasks */

/* 'less' compiles .less to .css and generates sourcemaps  */
gulp.task('less', function() {
	gulp.src(paths.lessFiles)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write('sourcemaps'))
		.pipe(gulp.dest(paths.stylesOutput))
});

/* 'sass' compiles .scss .scss to .css and generates sourcemaps  */
gulp.task('sass', function () {
	gulp.src(paths.scssFiles)
		.pipe(sass())
		.pipe(sourcemaps.write('sourcemaps'))
		.pipe(gulp.dest(paths.stylesOutput))
});

/* 'hint' warns via stdout js syntax errors */
gulp.task('hint', function() {
	gulp.src(paths.jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default', { verbose: true }));
});

/* 'watch' watches for file changes and executes respective tasks */
gulp.task('watch', function() {
	gulp.watch(paths.lessFiles, ['less']);
	gulp.watch(paths.jsFiles, ['hint'])
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
		.pipe(gulp.dest(paths.distFolder));
});

gulp.task('watcher', ['less', 'sass', 'hint', 'watch' ] );
gulp.task('deploy', ['usemin'] );