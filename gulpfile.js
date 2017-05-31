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
	sync = require( 'gulp-config-sync' ),
	header = require('gulp-header'),
	rimraf = require( 'rimraf' ),
	rigger = require( 'gulp-rigger' ),
	concat = require( 'gulp-concat' ),
	uglify = require( 'gulp-uglify' ),
	sass = require( 'gulp-sass' ),
	cssmin = require( 'gulp-minify-css' ),
	postcss = require( 'gulp-postcss' ),
	babel = require( 'gulp-babel' ),
	autoprefixer = require( 'autoprefixer' );

/* * * * * * * * * * * * * *
 * Переменные / Функции 
 * * * * * * * * * * * * * */

// Основные параметры плагина
var params = 
{
	pluginName: 'styler',
	fileName: 'jquery.formStylerModern'
};

// Пути
var paths = 
{
	src: { 
		main: './src/',
		script: './src/script/',
		frame: './src/frame/',
		style: './src/style/',
		styles: {
			default: '/',
			flat: 'flat/'
		}
	},
	
	build: './build/'
};

// Параметры сборок
var bundles =
{
	dev: {
		fileSuffix: '',
		compress: false,
		themePath: 'style/',
		mainPath: ''
	},
	
	min: {
		fileSuffix: '.min',
		compress: true,
		themePath: 'style/',
		mainPath: ''
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

// Синхронизация изменений конфигураций для bower и сomposer
gulp.task( 'config:sync', function( )
{
	var options = 
	{
		fields: [
			'version',
			'description',
			'keywords',
			'repository',
			'license',
			{
				from: 'contributors',
				to: 'authors'
			}
		],
		space: '  '
	};
	
	//
	gulp.src( [ 'bower.json', 'composer.json' ] )
		.pipe( sync( options ) ) // Синхронизируем данные
		.pipe( gulp.dest( '.' ) );
} );

// Задача обработки скриптов библиотеки
gulp.task( 'js:build', function( ) 
{
	// Основные параметры
	var fileName = params.fileName + bundle.fileSuffix + '.js',
		path = paths.build + bundle.mainPath;
	
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
				.pipe( rigger( ) ) // Подстановка исходного кода файлов на место переменных
				.pipe( header( banner, { pkg : pkg } ) ) // Установка хидера
				.pipe( babel( {	presets: [ 'es2015' ] } ) )
				.pipe( gulpif( bundle.compress, uglify( { mangle: true, compress: false } ) ) ) //
				.pipe( rename( fileName ) ) // Переименовываем
				.pipe( gulp.dest( path ) );
} );

// Функция для сборки SASS/SCSS
var scssBuildFunc = function( target, fileName, buildPath )
{
	return gulp.src( target )
				.pipe( debug( { title: 'scss:' } ) ) // Вывод пофайлового лога
				.pipe( replace( '%pluginName%', params.pluginName ) )
				.pipe( sass( { errLogToConsole: true } ) ) // Компилируем SCSS файлы
				.pipe( postcss( [ autoprefixer( ) ] ) ) // Добавим префиксы
				.pipe( gulpif( bundle.compress, cssmin( ) ) ) // Сжимаем
				.pipe( gulpif( Array.isArray( target ), concat( fileName + bundle.fileSuffix + '.css' ), rename( fileName + bundle.fileSuffix + '.css' ) ) ) // Переименовываем
				.pipe( gulp.dest( buildPath ) );
};

// Создаем SASS/SCSS задание
gulp.task( 'scss:theme:build', function( ) 
{ 
	var fileName = params.fileName,
		themePath = paths.build + bundle.themePath;

	// Собираем каркас
	scssBuildFunc( paths.src.frame + 'main.scss', fileName + '.frame', themePath );
		
	// Собираем стили
	for( var styleName in paths.src.styles )
	{
		scssBuildFunc( paths.src.style + paths.src.styles[ styleName ]  + 'main.scss', fileName + '.' + styleName, themePath );
	}
} );

// Сборка общего файла с темой по умолчанию
gulp.task( 'scss:theme:concat', function( )
{
	var fileName = params.fileName,
		mainPath = paths.build + bundle.mainPath;
		
	// Собираем общий файл с темой по умолчанию
	scssBuildFunc( [ paths.src.style + paths.src.styles[ 'default' ] + 'main.scss',
					paths.src.frame + 'main.scss' ], 
					fileName, mainPath );	
} );

// Задача по сборке
gulp.task( 'build', function( ) 
{
	// Делаем обычную версию
	gulp.start( 'js:build', 'scss:theme:build', 'scss:theme:concat' ); 
} );

// Задача по сборке
gulp.task( 'build:min', function( ) 
{
	// Делаем минифицированную версию
	bundle = bundles[ 'min' ];
	gulp.start( 'js:build', 'scss:theme:build', 'scss:theme:concat' ); 
} );

// Задача по умолчанию
gulp.task( 'default', function( ) 
{  
	// Запускаем основные задания
	gulp.start( 'clean', 'build' );

	/* * * * * * * * * * * * * *
	 * Смотрители 
	 * * * * * * * * * * * * * */

	gulp.watch( paths.src.script + '/*.js', [ 'js:build' ] ),
	gulp.watch( paths.src.style + '/**/*.scss', [ 'scss:theme:build', 'scss:theme:concat' ] );
} );