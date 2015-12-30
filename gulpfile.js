'use strict';

/* * * * * * * * * * * * * *
 *  Подключениемые модули 
 * * * * * * * * * * * * * */

var gulp = require( 'gulp' ),
	gulpif = require( 'gulp-if' ),
	rename = require( 'gulp-rename' ),
	replace = require('gulp-replace'),
	watch = require( 'gulp-watch' ),
	debug = require( 'gulp-debug' ),
	header = require('gulp-header'),
	rimraf = require( 'rimraf' ),
	rigger = require( 'gulp-rigger' ),
	uglify = require( 'gulp-uglify' ),
	sass = require( 'gulp-sass' ),
	cssmin = require( 'gulp-minify-css' ),
	postcss = require( 'gulp-postcss' ),
	autoprefixer = require( 'autoprefixer' );

/* * * * * * * * * * * * * *
 * Переменные / Функции 
 * * * * * * * * * * * * * */

// Основные параметры плагина
var params = 
{
	pluginName: 'styler',
	classPrefix: 'jq-',
	fileName: 'jquery.formStylerModern'
};

// Пути
var paths = 
{
	src: { 
		main: './src/',
		script: './src/script/',
		style: './src/style/'
	},
	
	build: './build/'
};

// Параметры сборок
var bundles =
{
	dev: {
		fileSuffix: '',
		compress: false,
		path: ''
	},
	
	min: {
		fileSuffix: '.min',
		compress: true,
		path: 'min/'
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
	var fileName = params.fileName + bundle.fileSuffix + '.js',
		path = paths.build + bundle.path;
	
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
				.pipe( replace( '%pluginName%', params.pluginName ) )
				.pipe( replace( '%classPrefix%', params.classPrefix ) )
				.pipe( rigger( ) ) // Подстановка исходного кода файлов на место переменных
				.pipe( header( banner, { pkg : pkg } ) ) // Установка хидера
				.pipe( gulpif( bundle.compress, uglify( { mangle: true, compress: false } ) ) ) //
				.pipe( rename( fileName ) ) // Переименовываем
				.pipe( gulp.dest( path ) );
} );

// Создаем SASS/SCSS задание	
gulp.task( 'scss:build', function( ) 
{ 
	var fileName = params.fileName + bundle.fileSuffix + '.css',
		path = paths.build + bundle.path;
	
	return gulp.src( paths.src.style + 'main.scss' )
				.pipe( debug( { title: 'scss:' } ) ) // Вывод пофайлового лога
				.pipe( replace( '%pluginName%', params.pluginName ) )
				.pipe( replace( '%classPrefix%', params.classPrefix ) )
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

	var wJS = gulp.watch( paths.src.script + '/*.js', [ 'js:build' ] ),
		wSASS = gulp.watch( paths.src.style + '/*.scss', [ 'scss:build' ] );
} );