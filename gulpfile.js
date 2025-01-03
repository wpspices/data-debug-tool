const gulp = require( 'gulp' ),
	notify = require( 'gulp-notify' ),
	del = require( 'del' ),
	zip = require( 'gulp-zip' );
const { series } = require( 'gulp' );

// Clean files
function clean_files() {
	let cleanPath = [ './plugin-zip/**' ];
	return del( cleanPath, { force: true } );
}

// create zip
function create_zip() {
	// Zip files list
	var zipPath = [
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

// create zip
function create_dev_zip() {
	// Zip files list
	var zipPath = [
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
exports.build = series( clean_files, create_dev_zip );

// (cmd: gulp): run for production
exports.default = series( clean_files, create_zip );
