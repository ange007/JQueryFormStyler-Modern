;( function( factory )
{
	// AMD
	if( typeof define === 'function' && define.amd ) { define( [ 'jquery' ], factory ); } 
	// CommonJS
	else if( typeof exports === 'object' ) { module.exports = factory( $ || require( 'jquery' ) ); } 
	// 
	else { factory( jQuery ); }
}

( function( $ )
{
	'use strict';

	var pluginName = '%pluginName%',	/* Имя плагина. 
										 * Используется для вызова плагина, 
										 * а так-же в качестве класса для 
										 * стилизации без "псевдо-компонентов" */
										  
		idSuffix = '-' + pluginName,	/* Суффикс - который подставляется к ID "псевдо-компонента" */

		// Параметры по умолчанию
		defaults = {
			locale: navigator.browserLanguage || navigator.language || navigator.userLanguage || 'en-US',
			
			select: {
				search: {
					limit: 10,
			
					ajax: { // JQuery Ajax параметры
						delay: 250,
						onSuccess: function( ) { }
					}
				},
				triggerHTML: '<div class="jq-selectbox__trigger-arrow"></div>',
				visibleOptions: 0,
				smartPosition: 0,
				onOpened: function( ) { },
				onClosed: function( ) { }
			},
			checkbox: {
				indeterminate: false
			},
			password: {
				switchHTML: '<button type="button" class="' + pluginName + '"></button>'
			},
			
			onFormStyled: function( ) { },
		},
		
		// Локализация
		locales = {
			// English
			'en-US': {
				file: {
					placeholder: 'No file selected',
					browse: 'Browse...',
					counter: 'Selected files: %s'
				},
				select: {
					placeholder: 'Select...',
					search: {
						notFound: 'No matches found',
						placeholder: 'Search...'
					}
				},
				password: {
					show: '&#10687;',
					hide: '&#10686;'
				}
			},
						
			// Русский
			'ru-RU': {
				file: {
					placeholder: 'Файл не выбран',
					browse: 'Обзор...',
					counter: 'Выбрано файлов: %s'
				},
				select: {
					placeholder: 'Выберите...',
					search: {
						notFound: 'Совпадений не найдено',
						placeholder: 'Поиск...'
					}
				}
			},
			
			// Українська
			'uk-UA': {
				file: {
					placeholder: 'Файл не обрано',
					browse: 'Огляд...',
					counter: 'Обрано файлів: %s'
				},
				select: {
					placeholder: 'Виберіть...',
					search: {
						notFound: 'Збігів не знайдено',
						placeholder: 'Пошук...'
					}
				}
			}
		};
		
	// Добавляем синонимы языковых кодов
	locales[ 'en' ] = locales[ 'en-US' ];
	locales[ 'ru' ] = locales[ 'ru-RU' ];
	locales[ 'ua' ] = locales[ 'uk-UA' ];

	// Конструктор плагина
	function Plugin( element, options )
	{
		// Запоминаем єлемент
		this.element = element;
		
		// Настройки
		this.options = $.extend( true, { }, defaults, options );
		
		// Расширяем английскую локализацию - выборанной локализацией из параметров
		var mainLocale = $.extend( true, { }, locales[ 'en-US' ], locales[ this.options.locale ] );

		// Расширяем полученный словарь словами переданными через настройки
		this.locales = $.extend( true, { }, mainLocale, this.options.locales );
		
		// Инициаплизация
		this.init( );
	}

	// Атрибуты елемента
	function Attributes( element )
	{
		if( element.attr( 'id' ) !== undefined && element.attr( 'id' ) !== '' ) 
		{
			this.id = element.attr( 'id' ) + idSuffix;
		}

		this.title = element.attr( 'title' );
		this.classes = element.attr( 'class' );
		this.data = element.data( );
	}

	// Расширение функционала плагина
	Plugin.prototype = 
	{
		// Инициализация
		init: function( )
		{
			//
			var context = this,
				element = $( this.element );

			//
			var iOS = ( navigator.userAgent.match( /(iPad|iPhone|iPod)/i ) && !navigator.userAgent.match( /(Windows\sPhone)/i ) ),
				Android = ( navigator.userAgent.match( /Android/i ) && !navigator.userAgent.match( /(Windows\sPhone)/i ) );

			// Чекбокс
			if( element.is( ':checkbox' ) )
			{
				//= _checkbox.js
			}
			// Радиокнопка
			else if( element.is( ':radio' ) )
			{
				//= _radio.js
			}
			// Выбор файла
			else if ( element.is( ':file' ) ) 
			{
				//= _file.js
			}
			// Номер
			else if( element.is( 'input[type="number"]' ) )
			{
				//= _number.js
			} 
			// Пароль
			else if( element.is('input[type="password"]' ) ) 
			{
				//= _password.js
			}
			// Скрытое поле
			else if( element.is( 'input[type="hidden"]' ) )
			{
				return false;
			}
			// Список
			else if( element.is( 'select' ) )
			{
				//= _selectbox.js
			}
			// Другие компоненты
			else if( element.is( 'input' ) || element.is( 'textarea' ) 
					|| element.is( 'button' ) || element.is( 'a.button' ) )
			{
				element.addClass( pluginName );
			}
			// Кнопка сброса
			else if( element.is( ':reset' ) )
			{
				element.on( 'click', function( )
				{
					setTimeout( function( ) 
					{ 
						element.closest( 'form' ).children( )
												.trigger( 'repaint' );
					}, 1 );
				} );
			}
			
			// Переинициализация
			element.on( 'refresh reinitialize', function( )
			{
				context.reinitialize( );
			} );
		},
		
		// Убрать стилизацию елемент(а/ов) 
		destroy: function( reinitialize )
		{
			var el = $( this.element );
			
			// Если происходит уничтожение для переинициализации - data удалять не нужно
			if( !reinitialize )
			{
				el.removeData( '_' + pluginName );
			}
			
			// Убираем "невидимлсть" елемента
			el.removeClass( 'jq-hidden' );

			// Дополнительная пост-обработка checkbox и radio
			if( el.is( ':checkbox' ) || el.is( ':radio' ) )
			{
				el.off( '.' + pluginName + ', refresh' )
					.removeAttr( 'style' )
					.parent( ).before( el ).remove( );
			
				el.closest( 'label' )
					.add( 'label[for="' + el.attr( 'id' ) + '"]' )
					.off( '.' + pluginName );
			}
			// Дополнительная пост-обработка number
			else if( el.is( 'input[type="number"]' ) )
			{
				el.off( '.' + pluginName + ', refresh' )
					.closest( '.jq-number' ).before( el ).remove( );
			} 
			// Дополнительная пост-обработка password
			else if( el.is( 'input[type="password"]' ) )
			{
				el.off( '.' + pluginName + ', refresh' )
					.closest( '.jq-password' ).before( el ).remove( );
			} 
			// Дополнительная пост-обработка file и select
			else if( el.is( ':file' ) || el.is( 'select' ) )
			{
				el.off( '.' + pluginName + ', refresh' )
					.removeAttr( 'style' )
					.parent( ).before( el ).remove( );
			}
		},

		// Переинициализация стилизованного элемента - с изменёнными параметрами
		reinitialize: function( options )
		{
			// Убираем стилизацию елементов
			this.destroy( true ); 

			// Перезаписываем настройки
			$.extend( this.options, options );
			
			// Расширяем текущий словарь словами переданными через настройки
			$.extend( this.locales, this.options.locales );

			// Снова инициализируем стилизацию
			this.init( );
		}
	};

	// Прописываем плагин в JQuery
	$.fn[ pluginName ] = function( options )
	{
		var args = arguments;
		
		// Если параметры это объект
		if( options === undefined || typeof options === 'object' )
		{
			// Проходим по компоненам
			this.each( function( )
			{
				if( !$.data( this, '_' + pluginName ) )
				{
					$.data( this, '_' + pluginName, new Plugin( this, options ) );
				}
				else
				{
					$( this ).styler( 'reinitialize' );
				}
			} )
			// Ожидаем полного прохода
			.promise( )
			// Колбек после выполнения плагина
			.done( function( )
			{
				var opt = $( this[0] ).data( '_' + pluginName );
				
				if( opt )
				{
					opt.options.onFormStyled.call( );
				}
			} );
					
			return this;
		}
		// Если параметры это строка
		else if( typeof options === 'string' && options[0] !== '_' && options !== 'init' )
		{
			var returns;
			
			this.each( function( )
			{
				var instance = $.data( this, '_' + pluginName );
				
				if( instance instanceof Plugin && typeof instance[ options ] === 'function' )
				{
					returns = instance[ options ].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
			} );
			
			return returns !== undefined ? returns : this;
		}
	};
	
	//= _extra.js
} ) );