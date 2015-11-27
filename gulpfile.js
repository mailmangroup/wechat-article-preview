'use strict';

var gulp = require( 'gulp' ),
	del = require( 'del' ),
	minifyCSS = require( 'gulp-minify-css' ),
	replace = require( 'gulp-replace' ),
	uglify = require( 'gulp-uglify' );


// COPY ALL FILES FROM ROOT TO DIST
// ===========================================================================================
gulp.task( 'copy', function() {

	return gulp.src( './src/**/*' )
		.pipe( gulp.dest( './dist' ) );

});


// MINIFY & MERGE CSS FILES
// ===========================================================================================
gulp.task( 'minify-css', [ 'copy' ], function() {

	return gulp.src( 'dist/*.css' )
		.pipe( minifyCSS({
			debug: true
		}) )
		.pipe( gulp.dest( 'dist/' ) );

});


// UGLIFY JS
// ===========================================================================================
gulp.task( 'uglify', [ 'copy' ], function() {

	gulp.src( 'dist/*.js' )
		.pipe( uglify() )
		.pipe( gulp.dest( 'dist/' ) );
});


// BUILD DIST FOLDER
// $ gulp build
// ===========================================================================================
gulp.task( 'build', [ 'minify-css', 'uglify' ], function () {

	// REPLACE RELATIVE PATH
	return gulp.src([ 'dist/*.js' ])
    	.pipe( replace( './src', './dist' ) )
    	.pipe( gulp.dest( 'dist/' ) );

});


// DEFAULT
// $ gulp
// ===========================================================================================
gulp.task( 'default', [
	'build'
]);