'use strict';

/* * * * * * * * * * * * * *
 *  Подключениемые модули 
 * * * * * * * * * * * * * */

var gulp = require( 'gulp' ),
	gulpif = require( 'gulp-if' ),
	sass = require( 'gulp-sass' ),
	cssmin = require( 'gulp-minify-css' ),
	postcss = require( 'gulp-postcss' ),
	autoprefixer = require( 'autoprefixer' ),
	concat = require( 'gulp-concat' ),
	uglify = require( 'gulp-uglify' ),
	rename = require( 'gulp-rename' ),
	rigger = require( 'gulp-rigger' ),
	watch = require( 'gulp-watch' ),
	debug = require( 'gulp-debug' ),
	rimraf = require( 'rimraf' );

/* * * * * * * * * * * * * *
 * Переменные / Функции 
 * * * * * * * * * * * * * */

// Пути
var paths = 
{
	src: { 
		main: 'src/',
		script: 'src/script/',
		style: 'src/style/'
	},
	
	build: {
		main: 'build/',
		min: 'build/min/'
	}
};

// Параметры сборок
var bundles =
{
	dev: {
		name: 'dev',
		compress: false,
		filename: 'jquery.formStylerModern'
	},
	
	min: {
		name: 'min',
		compress: true,
		filename: 'jquery.formStylerModern.min'
	}
};

// Сборка по умолчанию
var bundle = bundles[ 'dev' ];

/* * * * * * * * * * * * * *
 * Задачи 
 * * * * * * * * * * * * * */

// Очищаем директорию сборки
gulp.task( 'clean', function( )
{  
    return rimraf.sync( paths.build.main + '/**' );
} );

// Задача обработки скриптов библиотеки
gulp.task( 'js:build', function( ) 
{
	var fileName = bundle.filename + ( bundle.name === 'min' ? '.min' : '' ) + '.js',
		path = bundle.name === 'min' ? paths.build.min : paths.build.main;
	
    return gulp.src( paths.src.script + 'main.js')
				.pipe( rigger( ) )
				.pipe( concat( fileName ) ) // Объединение файлов
				.pipe( gulpif( bundle.compress, uglify( { mangle: true, compress: false } ) ) ) //
				.pipe( debug( { title: 'js:' } ) ) // Вывод пофайлового лога
				.pipe( gulp.dest( path ) );
} );

// Создаем SASS/SCSS задание	
gulp.task( 'scss:build', function( ) 
{ 
	var fileName = bundle.filename + ( bundle.name === 'min' ? '.min' : '' ) + '.css',
		path = bundle.name === 'min' ? paths.build.min : paths.build.main;
	
	return gulp.src( paths.src.style + 'main.scss' )
				.pipe( sass( { errLogToConsole: true } ) ) // Компилируем SCSS файлы
				.pipe( postcss( [ autoprefixer( ) ] ) ) // Добавим префиксы
				.pipe( gulpif( bundle.compress, cssmin( ) ) ) // Сжимаем
				.pipe( rename( fileName ) )
				.pipe( debug( { title: 'scss:' } ) ) // Вывод пофайлового лога
				.pipe( gulp.dest( path ) );	
} );

// Задача по сборке
gulp.task( 'build', function( ) 
{
	// Делаем обычную версию
	gulp.start( 'js:build', 'scss:build' ); 
} );

// Задача по сборке
gulp.task( 'build:min', function( ) 
{
	// Делаем минифицированную версию
	bundle = bundles[ 'min' ];
	gulp.start( 'js:build', 'scss:build' ); 
} );

// Задача по умолчанию
gulp.task( 'default', function( ) 
{  
	// Запускаем основные задания
	gulp.start( 'clean', 'build' );

	/* * * * * * * * * * * * * *
	 * Смотрители 
	 * * * * * * * * * * * * * */

	var wJS = gulp.watch( paths.src.libraries + '/*.js', [ 'js:build' ] ),
		wSASS = gulp.watch( paths.src.addons + '/*.scss', [ 'scss:build' ] );
} );