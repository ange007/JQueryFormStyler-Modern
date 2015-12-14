/*!
 * Developers:
 * Borisenko V.
 */

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

	var pluginName = 'styler',
		defaults = {
			wrapper: 'form',
			idSuffix: '-styler',
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
		this.init();
	}

	Plugin.prototype = 
	{
		// инициализация
		init: function()
		{
			var el = $( this.element ),
				opt = this.options;

			var iOS = ( navigator.userAgent.match( /(iPad|iPhone|iPod)/i ) && !navigator.userAgent.match( /(Windows\sPhone)/i ) ) ? true : false,
				Android = ( navigator.userAgent.match( /Android/i ) && !navigator.userAgent.match( /(Windows\sPhone)/i ) ) ? true : false;

			if( el.hasClass( opt.idSuffix ) )
			{
				return;
			} 
			else
			{
				el.addClass( opt.idSuffix );
			}

			function Attributes( )
			{
				var id = '',
					title = '',
					classes = '',
					dataList = '';
			
				if( el.attr( 'id' ) !== undefined && el.attr( 'id' ) !== '' )
				{
					id = ' id="' + el.attr( 'id' ) + opt.idSuffix + '"';
				}
				
				if( el.attr( 'title' ) !== undefined && el.attr( 'title' ) !== '' )
				{
					title = ' title="' + el.attr( 'title' ) + '"';
				}
			
				if( el.attr( 'class' ) !== undefined && el.attr( 'class' ) !== '' )
				{
					classes = ' ' + el.attr( 'class' );
				}
			
				var data = el.data();
				for( var i in data )
				{
					if( data[i] !== '' && i !== '_styler' )
					{
						dataList += ' data-' + i + '="' + data[i] + '"';
					}
				}
				
				id += dataList;
				this.id = id;
				this.title = title;
				this.classes = classes;
			}

			//
			if( el.is( ':checkbox' ) )
			{
				//= _checkbox.js
			}
			else if( el.is( ':radio' ) )
			{
				//= _radio.js
			}
			else if ( el.is( ':file' ) ) 
			{
				//= _file.js
			}
			else if( el.is( 'input[type="number"]' ) )
			{
				//= _number.js
			} 
			else if( el.is( 'select' ) )
			{
				//= _select.js
			}
			else if( el.is( ':reset' ) )
			{
				el.on( 'click', function()
				{
					setTimeout( function( ) { el.closest( opt.wrapper ).find( 'input, select' ).trigger( 'refresh' ); }, 1 );
				} );
			}
		},
		
		// Убрать стилизацию елемент(а/ов) 
		destroy: function( )
		{
			var el = $( this.element );

			//
			if( el.is( ':checkbox' ) || el.is( ':radio' ) )
			{
				el.removeData( '_' + pluginName ).off( '.styler refresh' ).removeAttr( 'style' ).parent().before( el ).remove();
				el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' ).off( '.styler' );
			}
			//
			else if( el.is( 'input[type="number"]' ) )
			{
				el.removeData( '_' + pluginName ).off( '.styler refresh' ).closest( '.jq-number' ).before( el ).remove();
			} 
			//
			else if( el.is( ':file' ) || el.is( 'select' ) )
			{
				el.removeData( '_' + pluginName ).off( '.styler refresh' ).removeAttr( 'style' ).parent().before( el ).remove();
			}

			// Удаляем класс по которому мы определяем что элемент уже стилизован
			el.removeClass( this.options.idSuffix );
		},

		// Переинициализация стилизованного элемента - с изменёнными параметрами
		reinitialize: function( options )
		{
			// Убираем стилизацию елементов
			this.destroy( );

			// Перезаписываем настройки и снова инициализируем стилизацию
			this.options = $.extend( { }, defaults, options );
			this.init( );
		}

	};

	// Прописываем плагин в JQuery
	$.fn[ pluginName ] = function( options )
	{
		var args = arguments;
		if( options === undefined || typeof options === 'object' )
		{
			//
			this.each( function()
			{
				if( !$.data( this, '_' + pluginName ) )
				{
					$.data( this, '_' + pluginName, new Plugin( this, options ) );
				}
			} )
			// колбек после выполнения плагина
			.promise()
			//
			.done( function()
			{
				var opt = $( this[0] ).data( '_' + pluginName );
				if( opt )

					opt.options.onFormStyled.call();
			} );
					
			return this;
		} 
		else if( typeof options === 'string' && options[0] !== '_' && options !== 'init' )
		{
			var returns;
			
			this.each( function()
			{
				var instance = $.data( this, '_' + pluginName );
				if( instance instanceof Plugin && typeof instance[options] === 'function' )
				{
					returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
			} );
			
			return returns !== undefined ? returns : this;
		}
	};
	
	//= _extra.js
} ) );