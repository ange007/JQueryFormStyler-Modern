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
										*	а так-же в качестве класса для 
										*	стилизации без "псевдо-компонентов" */
		idSuffix = '-' + pluginName,	/* Суффикс - который подставляется к ID "псевдо-компонента" */

		// Параметры по умолчанию
		defaults = {
			wrapper: 'form',
			selectTriggerHtml: '<div class="jq-selectbox__trigger-arrow"></div>',
			selectSearch: false,
			selectSearchLimit: 10,
			selectVisibleOptions: 0,
			singleSelectzIndex: '100',
			selectSmartPositioning: true,
			checkboxIndeterminate: false,
			passwordSwitchHtml: '<button type="button" class="' + pluginName + '"></button>',
			locale: 'ru',
			locales: 
			{
				'ru': {
					filePlaceholder: 'Файл не выбран',
					fileBrowse: 'Обзор...',
					fileNumber: 'Выбрано файлов: %s',
					selectPlaceholder: 'Выберите...',
					selectSearchNotFound: 'Совпадений не найдено',
					selectSearchPlaceholder: 'Поиск...',
					passwordShow: 'Показать',
					passwordHide: 'Скрыть'
				},
				'en': {
					filePlaceholder: 'No file selected',
					fileBrowse: 'Browse...',
					fileNumber: 'Selected files: %s',
					selectPlaceholder: 'Select...',
					selectSearchNotFound: 'No matches found',
					selectSearchPlaceholder: 'Search...',
					passwordShow: 'Show',
					passwordHide: 'Hide'
				},
				'ua': {
					filePlaceholder: 'Файл не обраний',
					fileBrowse: 'Огляд...',
					fileNumber: 'Обрано файлів: %s',
					selectPlaceholder: 'Виберіть...',
					selectSearchNotFound: 'Збігів не знайдено',
					selectSearchPlaceholder: 'Пошук...',
					passwordShow: 'Показати',
					passwordHide: 'Сховати'
				}
			},
			onSelectOpened: function( ) { },
			onSelectClosed: function( ) { },
			onFormStyled: function( ) { }
		};

	// Конструктор плагина
	function Plugin( element, options )
	{
		this.element = element;
		this.options = $.extend( { }, defaults, options );
		
		var locale = this.options.locale;
		if( this.options.locales[ locale ] !== undefined )
		{
			$.extend( this.options, this.options.locales[ locale ] );
		}
		
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
			var context = this,
				element = $( this.element ),
				opt = this.options;

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
						element.closest( opt.wrapper ).children( )
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

			// Перезаписываем настройки и снова инициализируем стилизацию
			this.options = $.extend( { }, this.options, options );
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