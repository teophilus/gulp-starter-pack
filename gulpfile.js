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
	rev            = require('gulp-rev'),
	del            = require('del'),
	browserSync    = require('browser-sync'),
	mainBowerFiles = require('main-bower-files'),
	htmlmin        = require('gulp-htmlmin');

// Paths 

var config = require('./gulp-config.json');

// Tasks List

function taskList(){
	gulp.watch(config.paths.lessFiles, ['less'])
	gulp.watch(config.paths.sassFiles, ['sass'])
	gulp.watch(config.paths.livescriptFiles, ['ls'])
	gulp.watch(config.paths.coffeeFiles, ['coffee'])
	gulp.watch(config.paths.jsFiles, ['hint']);
}

// Development Tasks 

// 'less' compiles .less to .css and generates sourcemaps  
gulp.task('less', function() {
	gulp.src(config.paths.lessFiles)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write(config.paths.sourcemapOutput))
		.pipe(gulp.dest(config.paths.stylesOutput))
		.pipe(browserSync.reload({stream:true}));
});

// 'sass' compiles .scss .scss to .css and generates sourcemaps  
gulp.task('sass', function() {
	gulp.src(config.paths.sassFiles)
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(sourcemaps.write(config.paths.sourcemapOutput))
		.pipe(gulp.dest(config.paths.stylesOutput))
		.pipe(browserSync.reload({stream:true}));
});

// 'ls' compiles .ls to .js and generates sourcemaps
gulp.task('ls', function() {
	gulp.src(config.paths.livescriptFiles)
		.pipe(sourcemaps.init())
		.pipe(gulpLiveScript({bare: true})
		.on('error', gutil.log))
		.pipe(sourcemaps.write(config.paths.sourcemapOutput))		
		.pipe(gulp.dest(config.paths.scriptsOutput))
		.pipe(browserSync.reload({stream:true}));
});

// 'coffee' compiles .coffee to .js and generates sourcemaps
gulp.task('coffee', function() {
	gulp.src(config.paths.coffeeFiles)
		.pipe(sourcemaps.init())
		.pipe(coffee({bare: true})
		.on('error', gutil.log))
		.pipe(sourcemaps.write(config.paths.sourcemapOutput))    
		.pipe(gulp.dest(config.paths.scriptsOutput))
		.pipe(browserSync.reload({stream:true}));
});

// 'hint' warns via stdout js syntax errors 
gulp.task('hint', function() {
	gulp.src(config.paths.jsFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default', { verbose: true }));
});

// 'watch' watches for file changes and executes respective tasks 
gulp.task('watch', function() {
	taskList();
});

// 'browser-sync' combines with 'watch' to create a live reload experience for rapid devolpement
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: (config.paths.app)
		}
	});
	taskList();
});


// Deploy Tasks

// bower files

gulp.task('bower-files', function() {
    	gulp.src(mainBowerFiles())
		.pipe(gulp.dest(config.paths.distFolder))
});

// 'clean' clean dist directory before a new build
gulp.task('clean', require('del').bind(null, ['config.paths.distFolder']));

// 'move' move necessary files to dist
gulp.task('move', function() {
	gulp.src(config.paths.indexFiles, { read: false })
	.pipe(gulp.dest(config.paths.distFolder));
});

// 'uncss' removed unused css
// @todo

// 'usemin' looks at 'html' files for the doc blocks to concatenate css & js, uglify js, minifies html, adds hashes to js & css to bypass caches  
gulp.task('usemin', function() {
	gulp.src(config.paths.indexFiles)
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
			],
			bowerJs: [

			]
		}))
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(config.paths.distFolder));
});

gulp.task('serve', ['browser-sync'] );
gulp.task('watcher', ['less', 'sass', 'ls', 'coffee', 'hint', 'watch' ] );
gulp.task('deploy', ['clean', 'move', 'usemin'] );