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

	/* Имя плагина. Используется для вызова плагина, 
	* а так-же в качестве класса для 
	 * стилизации без "псевдо-компонентов" */
	const pluginName = '%pluginName%';
										
	// Суффикс - который подставляется к ID "псевдо-компонента"
	const idSuffix = '-' + pluginName;

	// Параметры по умолчанию
	const defaults = 
	{
		locale: navigator.browserLanguage || navigator.language || navigator.userLanguage || 'en-US',

		select: {
			search: {
				limit: 10,

				/* @todo: Заготовка будущего функционала
				ajax: {
					delay: 250,
					onSuccess: function( ) { }
				}
				*/
			},
			triggerHTML: '<div class="jq-selectbox__trigger-arrow"></div>',
			visibleOptions: 0,
			smartPosition: true,
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
	};
		
	// Локализация
	let locales = 
	{
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

	// Конструктор плагина
	function Plugin( element, options )
	{
		// Запоминаем єлемент
		this.element = element;
		this.customElement = undefined;
		
		// Настройки
		this.options = $.extend( true, { }, defaults, options );
		
		// Расширяем английскую локализацию - выборанной локализацией из параметров
		let mainLocale = $.extend( true, { }, locales[ 'en-US' ], locales[ this.options.locale ] );

		// Расширяем полученный словарь словами переданными через настройки
		this.locales = $.extend( true, { }, mainLocale, this.options.locales );
		
		// Инициаплизация
		this.init( );
	}

	// Расширение функционала плагина
	Plugin.prototype = 
	{
		// Инициализация
		init: function( )
		{
			const context = this,
				element = $( this.element );

			// Определение мобильного браузера
			const iOS = ( navigator.userAgent.match( /(iPad|iPhone|iPod)/i ) && !navigator.userAgent.match( /(Windows\sPhone)/i ) ),
				Android = ( navigator.userAgent.match( /Android/i ) && !navigator.userAgent.match( /(Windows\sPhone)/i ) );

			// Чекбокс
			if( element.is( ':checkbox' ) )
			{
				//= _checkbox.js

				this.customElement = new CheckBox( element, this.options.checkbox, this.locales.checkbox );
			}
			// Радиокнопка
			else if( element.is( ':radio' ) )
			{
				//= _radio.js

				this.customElement = new Radio( element, this.options.radio, this.locales.radio );
			}
			// Выбор файла
			else if ( element.is( ':file' ) ) 
			{
				//= _file.js

				this.customElement = new File( element, this.options.file, this.locales.file );
			}
			// Номер
			else if( element.is( 'input[type="number"]' ) )
			{
				//= _number.js

				this.customElement = new Number( element, this.options.number, this.locales.number );
			} 
			// Пароль
			else if( element.is('input[type="password"]' ) && this.options.password.switchHTML !== undefined && this.options.password.switchHTML !== 'none' ) 
			{
				//= _password.js

				this.customElement = new Password( element, this.options.password, this.locales.password );
			}
			// Скрытое поле
			else if( element.is( 'input[type="hidden"]' ) )
			{
				return;
			}
			// Список
			else if( element.is( 'select' ) )
			{
				//= _selectbox-extra.js
				//= _selectbox.js
				//= _selectbox-multi.js
				
				// Стилизируем компонент
				if( element.is( '[multiple]' ) || element.attr( 'size' ) > 1 )
				{
					this.customElement = new SelectBoxMulti( element, this.options.select, this.locales.select );
				} 
				else
				{
					this.customElement = new SelectBox( element, this.options.select, this.locales.select );
				}
			}
			// Другие компоненты
			else if( element.is( 'input' ) || element.is( 'textarea' ) 
					|| element.is( 'button' ) || element.is( 'a.button' ) )
			{
				// Добавляем класс
				element.addClass( pluginName );
				
				// Обработка кнопки сброса
				if( element.is( 'input[type="reset"]' ) )
				{
					element.on( 'click', function( )
					{
						setTimeout( function( ) { element.closest( 'form' ).children( ).trigger( 'repaint' ); }, 1 );
					} );
				}
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
			const el = $( this.element );
			
			// Если происходит уничтожение для переинициализации - data удалять не нужно
			if( !reinitialize )
			{
				el.removeData( '_' + pluginName );
			}
			
			// Убираем "невидимлсть" елемента
			el.removeClass( 'jq-hidden' );

			// Дополнительная пост-обработка checkbox и radio
			if( this.customElement !== undefined )
			{
				this.customElement.destroy( );
			}
			// Дополнительная пост-обработка file и select
			else if( el.is( 'select' ) )
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
		const args = arguments;
		
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
				let opt = $( this[0] ).data( '_' + pluginName );
				
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
			let returns = undefined;
			
			//
			this.each( function( )
			{
				const instance = $.data( this, '_' + pluginName );
				
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