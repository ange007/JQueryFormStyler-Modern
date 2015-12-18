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
	header = require('gulp-header'),
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
	// Основные параметры
	var fileName = bundle.filename + '.js',
		path = bundle.name === 'min' ? paths.build.min : paths.build.main;
	
	// Формируем заголовок для файла
	var pkg = require( './package.json' ),
		banner = [ '/**',
					' * <%= pkg.name %> - <%= pkg.description %>',
					' * @version v<%= pkg.version %>',
					' * @link <%= pkg.homepage %>',
					' * @license <%= pkg.license %>',
					' * @author <%= pkg.author %>',
					' */',
					'',
					'' ].join( '\n' );
	
	// Собираем файл
    return gulp.src( paths.src.script + 'main.js')
				.pipe( debug( { title: 'js:' } ) ) // Вывод пофайлового лога
				.pipe( rigger( ) ) // Объединение js файлов
				.pipe( concat( fileName ) ) // Объединение файлов
				.pipe( header( banner, { pkg : pkg } ) ) // Установка хидера
				.pipe( gulpif( bundle.compress, uglify( { mangle: true, compress: false } ) ) ) //
				.pipe( gulp.dest( path ) );
} );

// Создаем SASS/SCSS задание	
gulp.task( 'scss:build', function( ) 
{ 
	var fileName = bundle.filename + '.css',
		path = bundle.name === 'min' ? paths.build.min : paths.build.main;
	
	return gulp.src( paths.src.style + 'main.scss' )
				.pipe( debug( { title: 'scss:' } ) ) // Вывод пофайлового лога
				.pipe( sass( { errLogToConsole: true } ) ) // Компилируем SCSS файлы
				.pipe( postcss( [ autoprefixer( ) ] ) ) // Добавим префиксы
				.pipe( gulpif( bundle.compress, cssmin( ) ) ) // Сжимаем
				.pipe( rename( fileName ) ) // Переименовываем
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