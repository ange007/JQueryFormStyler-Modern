;( function( factory )
{
	// AMD
	if( typeof define === 'function' && define.amd ) { define( [ 'jquery' ], factory ); } 
	// CommonJS
	else if( typeof exports === 'object' ) { module.exports = factory( require( 'jquery' ) ); } 
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
		classPrefix = '%classPrefix%',	/* Преффикс -  */
	
		defaults = {
			wrapper: 'form',
			filePlaceholder: 'Файл не выбран',
			fileBrowse: 'Обзор...',
			fileNumber: 'Выбрано файлов: %s',
			selectPlaceholder: 'Выберите...',
			selectSearch: false,
			selectSearchLimit: 10,
			selectSearchNotFound: 'Совпадений не найдено',
			selectSearchPlaceholder: 'Поиск...',
			selectVisibleOptions: 0,
			singleSelectzIndex: '100',
			selectSmartPositioning: true,
			checkboxIndeterminate: false,
			onSelectOpened: function( ) { },
			onSelectClosed: function( ) { },
			onFormStyled: function( ) { }
		};

	function Plugin( element, options )
	{
		this.element = element;
		this.options = $.extend( { }, defaults, options );
		this.init( );
	}

	Plugin.prototype = 
	{
		// Инициализация
		init: function( )
		{
			var el = $( this.element ),
				opt = this.options;

			var iOS = ( navigator.userAgent.match( /(iPad|iPhone|iPod)/i ) && !navigator.userAgent.match( /(Windows\sPhone)/i ) ) ? true : false,
				Android = ( navigator.userAgent.match( /Android/i ) && !navigator.userAgent.match( /(Windows\sPhone)/i ) ) ? true : false;

			function Attributes( )
			{
				var id = '',
					title = '',
					classes = '',
					dataList = '';
			
				if( el.attr( 'id' ) !== undefined && el.attr( 'id' ) !== '' )
				{
					id = ' id="' + el.attr( 'id' ) + idSuffix + '"';
				}
				
				if( el.attr( 'title' ) !== undefined && el.attr( 'title' ) !== '' )
				{
					title = ' title="' + el.attr( 'title' ) + '"';
				}
			
				if( el.attr( 'class' ) !== undefined && el.attr( 'class' ) !== '' )
				{
					classes = ' ' + el.attr( 'class' );
				}
			
				var data = el.data( );
				
				for( var i in data )
				{
					if( data[i] !== '' && ( i !== '_' + pluginName ) )
					{
						dataList += ' data-' + i + '="' + data[i] + '"';
					}
				}
				
				id += dataList;
				this.id = id;
				this.title = title;
				this.classes = classes;
			}

			// Чекбокс
			if( el.is( ':checkbox' ) )
			{
				//= _checkbox.js
			}
			// Радиокнопка
			else if( el.is( ':radio' ) )
			{
				//= _radio.js
			}
			// Выбор файла
			else if ( el.is( ':file' ) ) 
			{
				//= _file.js
			}
			// Номер
			else if( el.is( 'input[type="number"]' ) )
			{
				//= _number.js
			} 
			// Список
			else if( el.is( 'select' ) )
			{
				//= _select.js
			}
			// Скрытое поле
			else if( el.is( 'input[type="hidden"]' ) )
			{
				return false;
			}
			// Другие компоненты
			else if( el.is( 'input' ) )
			{
				el.addClass( pluginName );
			}
			// Кнопка сброса
			else if( el.is( ':reset' ) )
			{
				el.on( 'click', function( )
				{
					setTimeout( function( ) { el.closest( opt.wrapper ).find( 'input, select' ).trigger( 'refresh' ); }, 1 );
				} );
			}
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

			//
			if( el.is( ':checkbox' ) || el.is( ':radio' ) )
			{
				el.off( '.' + pluginName + ' refresh' )
					.removeAttr( 'style' )
					.parent( ).before( el ).remove( );
			
				el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' ).off( '.' + pluginName );
			}
			//
			else if( el.is( 'input[type="number"]' ) )
			{
				el.off( '.' + pluginName + ' refresh' )
					.closest( '.' + classPrefix + 'number' ).before( el ).remove( );
			} 
			//
			else if( el.is( ':file' ) || el.is( 'select' ) )
			{
				el.off( '.' + pluginName + ' refresh' )
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
			this.options = $.extend( { }, defaults, options );
			this.init( );
			
			// Вызываем событие
			// this.change( );
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