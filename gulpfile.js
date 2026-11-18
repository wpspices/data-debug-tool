const gulp = require( 'gulp' );
const notify = require( 'gulp-notify' );
const del = require( 'del' );
const zip = require( 'gulp-zip' );
const { series } = require( 'gulp' );

// Clean files
function cleanFiles() {
	const cleanPath = [ './plugin-zip/**' ];
	return del( cleanPath, { force: true } );
}

// create zip
function createZip() {
	// Zip files list
	const zipPath = [
		'./',
		'./**',
		'!./node_modules',
		'!./node_modules/**',
		'!./plugin-zip',
		'!./plugin-zip/**',
		'!./src',
		'!./src/**',
		'!./gulpfile.js',
		'!./package.json',
		'!./package-lock.json',
		'!./phpcs.xml',
		'!./LICENSE.txt',
		'!./README.md',
	];

	return gulp
		.src( zipPath, { base: '../' } )
		.pipe( zip( 'data-debug-tool.zip' ) )
		.pipe( gulp.dest( './plugin-zip/' ) )
		.pipe(
			notify( {
				message: 'Plugin zip ready!',
				onLast: true,
			} )
		);
}

// create dev zip
function createDevZip() {
	// Zip files list
	const zipPath = [
		'./',
		'./**',
		'!./node_modules',
		'!./node_modules/**',
		'!./plugin-zip',
		'!./plugin-zip/**',
		'!./gulpfile.js',
		'!./package.json',
		'!./package-lock.json',
		'!./phpcs.xml',
	];

	return gulp
		.src( zipPath, { base: '../' } )
		.pipe( zip( 'data-debug-tool.zip' ) )
		.pipe( gulp.dest( './plugin-zip/' ) )
		.pipe(
			notify( {
				message: 'Plugin zip ready!',
				onLast: true,
			} )
		);
}

// (cmd: gulp build): run for development
exports.build = series( cleanFiles, createDevZip );

// (cmd: gulp): run for production
exports.default = series( cleanFiles, createZip );
