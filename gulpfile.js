'use strict';

/* * * * * * * * * * * * * *
 *  Подключениемые модули 
 * * * * * * * * * * * * * */

var gulp = require( 'gulp' ),
	gulpif = require('gulp-if'),
	sass = require( 'gulp-sass' ),
	cssmin = require( 'gulp-minify-css' ),
	postcss = require( 'gulp-postcss' ),
	autoprefixer = require( 'autoprefixer' ),
	concat = require( 'gulp-concat' ),
	uglify = require('gulp-uglify'),
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

// Обработка стилей
gulp.task( 'other:transfer', function( )
{
    return gulp.src( [ paths.src.main + '/**/*.*', 
						'!' +  paths.src.main + '/**/*.+(js|css|scss)' ], { base: paths.src.main } )
        .pipe( gulp.dest( gulpif( bundle.name === 'min', paths.build.min, paths.build.main ) ) );
} );

// Задача обработки скриптов библиотеки
gulp.task( 'js:build', function( ) 
{
    return gulp.src( paths.src.script + 'main.js', { base: paths.src.main } )
				.pipe( rigger( ) )
				.pipe( concat( bundle.filename + '.js' ) )
				.pipe( debug( { title: 'js:' } ) ) // Вывод пофайлового лога
				.pipe( gulpif( bundle.compress, uglify( { mangle: true, compress: false } ) ) )
				.pipe( gulp.dest( gulpif( bundle.name === 'min', paths.build.min, paths.build.main ) ) );
} );

// Создаем SASS/SCSS задание	
gulp.task( 'scss:build', function( ) 
{ 
	return gulp.src( paths.src.style + '/**/*.scss', { base: paths.src.main } )
				.pipe( sass( { errLogToConsole: true } ) ) // Компилируем SCSS файлы
				.pipe( postcss( [ autoprefixer( ) ] ) ) // Добавим префиксы
				.pipe( gulpif( bundle.compress, cssmin( ) ) ) // Сжимаем
				.pipe( gulp.dest( gulpif( bundle.name === 'min', paths.build.min, paths.build.main ) ) );	
} );

// Обработка стилей
gulp.task( 'css:build', function( )
{ 
    return gulp.src( paths.src.style + '/**/*.css', { base: paths.src.main } )
				.pipe( postcss( [ autoprefixer( ) ] ) ) // Добавляем префиксы
				.pipe( gulpif( bundle.compress, cssmin( ) ) ) // Сжимаем
				.pipe( gulp.dest( gulpif( bundle.name === 'min', paths.build.min, paths.build.main ) ) );
} );

// Задача по сборке
gulp.task( 'build', function( ) 
{
	// Делаем обычную версию
	gulp.start( 'js:build', 'scss:build', 'css:build', 'other:transfer' ); 
} );

// Задача по сборке
gulp.task( 'build:min', function( ) 
{
	// Делаем минифицированную версию
	bundle = bundles[ 'min' ];
	gulp.start( 'js:build', 'scss:build', 'css:build', 'other:transfer' ); 
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
		wSASS = gulp.watch( paths.src.addons + '/*.scss', [ 'scss:build' ] ),
		wCSS = gulp.watch( paths.src.addons + '/*.css', [ 'css:build' ] ),
		wOther = gulp.watch( [ paths.src.main + '/**/*.*', 
								'!' +  paths.src.main + '/**/*.+(js|css|scss)' ], [ 'other:transfer' ] );
} );