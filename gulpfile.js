var gulp           = require('gulp'),
	less           = require('gulp-less'),
	sass           = require('gulp-sass'),
	sourcemaps     = require('gulp-sourcemaps'),
	gulpLiveScript = require('gulp-livescript'),
	coffee         = require('gulp-coffee'),
	uglify         = require('gulp-uglify'),
	gutil          = require('gulp-util'),
	jshint         = require('gulp-jshint'),
	usemin         = require('gulp-usemin'),
	minifyCss      = require('gulp-minify-css'),
	rev            = require('gulp-rev');

// Paths 

var config = require('./gulp-config.json');

// Development Tasks 

// 'less' compiles .less to .css and generates sourcemaps  
gulp.task('less', function() {
	gulp.src(config.paths.lessFiles)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write(config.paths.sourcemapOutput))
		.pipe(gulp.dest(config.paths.stylesOutput))
});

// 'sass' compiles .scss .scss to .css and generates sourcemaps  
gulp.task('sass', function() {
	gulp.src(config.paths.scssFiles)
		.pipe(sass())
		.pipe(sourcemaps.write(config.paths.sourcemapOutput))
		.pipe(gulp.dest(config.paths.stylesOutput))
});

// 'ls' compiles .ls to .js and generates sourcemaps
gulp.task('ls', function() {
	gulp.src(config.paths.livescriptFiles)
		.pipe(gulpLiveScript({bare: true})
		.on('error', gutil.log))
		.pipe(sourcemaps.write(config.paths.sourcemapOutput))		
		.pipe(gulp.dest(config.paths.jsFiles));
});

// 'coffee' compiles .coffee to .js and generates sourcemaps
gulp.task('coffee', function() {
	gulp.src(config.paths.coffeeFiles)
		.pipe(coffee({bare: true})
		.on('error', gutil.log))
		.pipe(sourcemaps.write(config.paths.sourcemapOutput))    
		.pipe(gulp.dest(config.paths.jsFiles));
});

// 'hint' warns via stdout js syntax errors 
gulp.task('hint', function() {
	gulp.src(config.paths.jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default', { verbose: true }));
});

// 'watch' watches for file changes and executes respective tasks 
gulp.task('watch', function() {
	gulp.watch(config.paths.lessFiles, ['less'])
	gulp.watch(config.paths.sassFiles, ['sass'])
	gulp.watch(config.paths.livescriptFiles, ['ls'])
	gulp.watch(config.paths.coffeeFiles, ['coffee'])
	gulp.watch(config.paths.jsFiles, ['hint']);
});

// Deploy Tasks 

// 'usemin' looks at 'html' files for the doc blocks to concatenate css & js, uglify js, adds hashes to js & css to bypass caches  
gulp.task('usemin', function() {
	gulp.src('app/*.html')
		.pipe(usemin({
			css: [
				sourcemaps.init(),
				minifyCss(),
				'concat',
				rev(),
				sourcemaps.write(config.paths.distSourcemaps)
			],
			js: [
				sourcemaps.init(),
				uglify(),
				rev(),
				sourcemaps.write(config.paths.distSourcemaps)
			]
		}))
		.pipe(gulp.dest(config.paths.distFolder));
});

gulp.task('watcher', ['less', 'sass', 'ls', 'coffee', 'hint', 'watch' ] );
gulp.task('deploy', ['usemin'] );