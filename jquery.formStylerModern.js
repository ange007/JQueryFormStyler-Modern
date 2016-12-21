/**
 * jquery-formstyler-modern - JQuery HTML form styling plugin
 * @version v1.2.0
 * @link https://github.com/ange007/JQueryFormStyler-Modern
 * @license MIT
 * @author Borisenko Vladimir ( original: Dimox <http://dimox.name/> )
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

	var pluginName = 'styler',	/* Имя плагина. 
										* Используется для вызова плагина, 
										*	а так-же в качестве класса для 
										*	стилизации без "псевдо-компонентов" */
		idSuffix = '-' + pluginName,	/* Суффикс - который подставляется к ID "псевдо-компонента" */
	
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
				if( el.attr( 'id' ) !== undefined && el.attr( 'id' ) !== '' ) 
				{
					this.id = el.attr( 'id' ) + idSuffix;
				}
				
				this.title = el.attr( 'title' );
				this.classes = el.attr( 'class' );
				this.data = el.data( );
			}

			// Чекбокс
			if( el.is( ':checkbox' ) )
			{
				var checkboxOutput = function( )
				{
					var att = new Attributes( ),
						checkbox = $('<div class="jq-checkbox"><div class="jq-checkbox__div"></div></div>')
									.attr( { id: att.id, title: att.title } )
									.addClass( att.classes )
									.data( att.data );
				
					// Прячем оригинальный чекбокс
					el.css( {
						position: 'absolute',
						zIndex: '-1',
						opacity: 0,
						margin: 0,
						padding: 0
					} )
					.after( checkbox ).prependTo( checkbox );
				
					// 
					checkbox.attr( 'unselectable', 'on' )
						.css( {
							'-webkit-user-select': 'none',
							'-moz-user-select': 'none',
							'-ms-user-select': 'none',
							'-o-user-select': 'none',
							'user-select': 'none',
							display: 'inline-block',
							position: 'relative',
							overflow: 'hidden'
					} );
				
					// Установка активности
					if( el.is( ':disabled' ) )
					{
						checkbox.addClass( 'disabled' );
					}
					
					// Клик по псевдоблоку ( смена состояния )
					checkbox.click( function( e )
					{
						e.preventDefault( );
				
						// Обрабатываем только активный псевдобокс
						if( !checkbox.is( '.disabled' ) )
						{
							// Текущее состояние: "Отмечено"
							if( el.is( ':checked' ) || el.is( ':indeterminate' ) )
							{
								// ... если работаем через 3 состояния - отмечаем "не определено",  или просто снимаем отметку
								el.prop( 'checked', ( opt.checkboxIndeterminate === true && el.is( ':indeterminate' ) ) );
				
								// "Неопределено" в любом случае снимаем
								el.prop( 'indeterminate', false );
							}
							// Текущее состояние: "Не отмечено"
							else
							{
								// ... если работаем через 3 состояния - отмечаем "не определено"
								if( opt.checkboxIndeterminate === true )
								{
									el.prop( 'checked', false );
									el.prop( 'indeterminate', true );
								}
								// ... или просто отмечаем
								else
								{
									el.prop( 'checked', true );
									el.prop( 'indeterminate', false );
								}
							}
							
							// Фокусируем и изменяем вызываем состояние изменения
							el.focus( )
								.change( );
						}
					} );
				
					// Клик по label привязанному к данному checkbox
					el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' ).on( 'click.' + pluginName, function( e )
					{
						if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( checkbox ).length )
						{
							checkbox.triggerHandler( 'click' );
							e.preventDefault( );
						}
					} );
				
					// Обработка изменений
					el.on( 'change.' + pluginName, function( )
					{
						// Отмечено
						if( el.is( ':checked' ) || el.is( ':indeterminate' ) )
						{
							if( el.is( ':indeterminate' ) )
							{
								checkbox.removeClass( 'checked' );
								checkbox.addClass( 'indeterminate' );
							}
							else
							{
								checkbox.removeClass( 'indeterminate' );
								checkbox.addClass( 'checked' );
							}
						}
						// Не отмечено
						else
						{
							checkbox.removeClass( 'indeterminate' );
							checkbox.removeClass( 'checked' );
						}
					} )
					// Обработка переключения при помощи клавиатуры
					.on( 'keydown.' + pluginName, function( e )
					{
						if( e.which === 32 )
						{
							e.preventDefault( );
							checkbox.click( );
						}
					} )
					// Обработка наведения фокуса
					.on( 'focus.' + pluginName, function( )
					{
						if( !checkbox.is( '.disabled' ) )
						{
							checkbox.addClass( 'focused' );
						}
					} )
					// Обработка снятия фокуса
					.on( 'blur.' + pluginName, function( )
					{
						checkbox.removeClass( 'focused' );
					} );
					
					// Мы установили стиль, уведомляем об изменении
					el.change( );
				};
				
				// Стилизируем компонент
				checkboxOutput( );
				
				// Обновление при динамическом изменении
				el.on( 'refresh', function( )
				{
					//
					el.closest( 'label' )
						.add( 'label[for="' + el.attr( 'id' ) + '"]' )
						.off( '.' + pluginName );
				
					// Убираем стилизацию компонента
					el.off( '.' + pluginName )
						.parent( ).before( el ).remove( );
				
					// Стилизируем компонент снова
					checkboxOutput( );
				} );
			}
			// Радиокнопка
			else if( el.is( ':radio' ) )
			{
				var radioOutput = function( )
				{
					var att = new Attributes( ),
						radio = $( '<div class="jq-radio"><div class="jq-radio__div"></div></div>' )
								.attr( { id: att.id, title: att.title } )
								.addClass( att.classes )
								.data( att.data );
				
					// Прячем оригинальную радиокнопку
					el.css( {
						position: 'absolute',
						zIndex: '-1',
						opacity: 0,
						margin: 0,
						padding: 0
					} )
					.after( radio ).prependTo( radio );
				
					//
					radio.attr( 'unselectable', 'on' )
						.css( {
							'-webkit-user-select': 'none',
							'-moz-user-select': 'none',
							'-ms-user-select': 'none',
							'-o-user-select': 'none',
							'user-select': 'none',
							display: 'inline-block',
							position: 'relative'
					} );
				
					// Установка изначального состояния псевдоблока
					if( el.is( ':disabled' ) )
					{
						radio.addClass( 'disabled' );
					} 
					
					// Клик по псевдоблоку
					radio.click( function( e )
					{
						//
						e.preventDefault( );
				
						// Обрабатываем только активную радиокнопку
						if( !radio.is( '.disabled' ) )
						{
							// Ищем нужный нам елемент в блоке который указан в настройках ( по умолчанию form )
							var findElement = radio.closest( opt.wrapper )
												.find( 'input[name="' + el.attr( 'name' ) + '"]:radio' );
				
							// ... если не нашли - ищем по родителям
							if( findElement.length <= 0 )
							{
								findElement = radio.closest( '#' + el.attr( 'name' ) )
												.find( 'input[name="' + el.attr( 'name' ) + '"]:radio' );
							}
				
							// ... или же по всему документу
							if( findElement.length <= 0 )
							{
								findElement = $( 'body' ).find( 'input[name="' + el.attr( 'name' ) + '"]:radio' );
							}
				
							// Снимаем отметку с найденного блока
							findElement.prop( 'checked', false )
									.parent( ).removeClass( 'checked' );			
				
							// Передаём фокус и вызываем событие - изменения
							el.prop( 'checked', true )
								.focus( )
								.change( );
						}
					} );
						
					// Переключение стрелками
					el.on( 'change.' + pluginName, function( e )
					{
						if( !el.is( ':disabled' ) )
						{
							if( $( this ).is(':checked') )
							{
								el.parent( )
									.addClass( 'checked' );
							}
							else
							{
								el.parent( )
									.removeClass( 'checked' );
							}
						}
						
					} )
					// Обработка наведения фокуса
					.on( 'focus.' + pluginName, function( )
					{
						if( !radio.is( '.disabled' ) )
						{
							radio.addClass( 'focused' );
						}
					} )
					// Обработка снятия фокуса
					.on( 'blur.' + pluginName, function( )
					{
						radio.removeClass( 'focused' );
					} );
					
					// Клик на label
					el.closest( 'label' )
						.add( 'label[for="' + el.attr( 'id' ) + '"]' )
						.on( 'click.' + pluginName, function( e )
					{
						if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( radio ).length )
						{
							radio.triggerHandler( 'click' );
							e.preventDefault( );
						}
					} );
					
					// Мы установили стиль, уведомляем об изменении
					el.change( );
				};
				
				// Стилизируем компонент
				radioOutput( );
				
				// Обновление при динамическом изменении
				el.on( 'refresh', function( )
				{
					//
					el.closest( 'label' )
						.add( 'label[for="' + el.attr( 'id' ) + '"]' )
						.off( '.' + pluginName );
				
					// Убираем стилизацию компонента
					el.off( '.' + pluginName )
						.parent( ).before( el ).remove( );
				
					// Стилизируем компонент снова
					radioOutput( );
				} );
			}
			// Выбор файла
			else if ( el.is( ':file' ) ) 
			{
				// прячем оригинальное поле
				el.css( {
					position: 'absolute',
					top: 0,
					right: 0,
					opacity: 0,
					margin: 0,
					padding: 0,
					fontSize: '100px'
				} );
				
				var fileOutput = function( )
				{
					var att = new Attributes( ), 
						placeholder = el.data( 'placeholder' ),
						browse = el.data( 'browse' );
						
					if( placeholder === undefined )
					{
						placeholder = opt.filePlaceholder;
					}
				
					if( browse === undefined || browse === '' )
					{
						browse = opt.fileBrowse;
					}
					
					// Формируем блок
					var file = $( '<div class="jq-file">' +
									'<div class="jq-file__name">' + placeholder + '</div>' +
									'<div class="jq-file__browse">' + browse + '</div>' +
									'</div>' )
								.css( { display: 'inline-block',
										position: 'relative',
										overflow: 'hidden' } )
								.attr( { id: att.id,
										title: att.title } )
								.addClass( att.classes )
								.data( att.data );
								
					// Добавляем блок 
					el.after( file ).appendTo( file );
				
					// 
					if( el.is( ':disabled' ) )
					{
						file.addClass( 'disabled' );
					}
				
					// Обработка "изменения" состояния
					el.on( 'change.' + pluginName, function( )
					{
						var value = el.val( ),
							name = $('div.jq-file__name', file);
						
						if( el.is( '[multiple]' ) )
						{
							var files = el[0].files.length;
							value = '';
							
							if( files > 0 )
							{
								var number = el.data( 'number' );
								
								if( number === undefined )
								{
									number = opt.fileNumber;
								}
								
								number = number.replace( '%s', files );
								value = number;
							}
						}
						
						name.text( value.replace( /.+[\\\/]/, '' ) );
						
						if( value === '' )
						{
							name.text( placeholder );
							file.removeClass( 'changed' );
						} 
						else
						{
							file.addClass( 'changed' );
						}
					} )
					// Работа с "фокусировкой"
					.on( 'focus.' + pluginName, function( )
					{
						file.addClass( 'focused' );
					} )
					.on( 'blur.' + pluginName, function( )
					{
						file.removeClass( 'focused' );
					} )
					.on( 'click.' + pluginName, function( )
					{
						file.removeClass( 'focused' );
					} );
					
					// Мы установили стиль, уведомляем об изменении
					el.change( );
				};
				
				// Стилизируем компонент
				fileOutput( );
				
				// Обновление при динамическом изменении
				el.on( 'refresh', function( )
				{
					// Убираем стилизацию компонента
					el.off( '.' + pluginName )
						.parent( ).before( el ).remove( );
						
					// Стилизируем компонент снова
					fileOutput( );
				} );
			}
			// Номер
			else if( el.is( 'input[type="number"]' ) )
			{
				var numberOutput = function( )
				{
					// Инициализируем переменные
					var min,
						max,
						step,
						timeout = null,
						interval = null;
				
					// Формируем компонент
					var att = new Attributes( ),
						number =
							$( '<div class="jq-number">' +
								'<div class="jq-number__spin minus"></div>' +
								'<div class="jq-number__spin plus"></div>' +
								'</div>' )
							.attr( { id: att.id,
									title: att.title } )
							.addClass( att.classes )
							.data( att.data );
				
					
					// Добавляем нужные блоки
					el.after( number ).prependTo( number )
										.wrap( '<div class="jq-number__field"></div>' );
				
					// Обработка "неактивности"
					if( el.is( ':disabled' ) )
					{
						number.addClass( 'disabled' );
					}
				
					if( el.attr( 'min' ) !== undefined )
					{
						min = el.attr( 'min' );
					}
					
					if( el.attr( 'max' ) !== undefined )
					{
						max = el.attr( 'max' );
					}
					
					if( el.attr( 'step' ) !== undefined && $.isNumeric( el.attr( 'step' ) ) )
					{
						step = Number( el.attr( 'step' ) );
					}
					else
					{
						step = Number( 1 );
					}
				
					// Изменение значения
					var changeValue = function( spin )
					{
						var value = el.val( ),
							newValue;
					
						if( !$.isNumeric( value ) )
						{
							value = 0;
							el.val( '0' )
								.change( );
						}
						
						if( spin.is( '.minus' ) )
						{
							newValue = Number(value) - step;
						} 
						else if( spin.is( '.plus' ) )
						{
							newValue = Number(value) + step;
						}
						
						// Определяем количество десятичных знаков после запятой в step
						var decimals = ( step.toString().split( '.' )[1] || [ ] ).length.prototype,
							multiplier = '1';
							
						if( decimals > 0 )
						{
							while( multiplier.length <= decimals )
							{
								multiplier = multiplier + '0';
							}
							
							// Избегаем появления лишних знаков после запятой
							newValue = Math.round( newValue * multiplier ) / multiplier;
						}
						
						if( $.isNumeric( min ) && $.isNumeric( max ) )
						{
							if( newValue >= min && newValue <= max )
							{
								el.val( newValue )
									.change( );
							}
						} 
						else if( $.isNumeric( min ) && !$.isNumeric( max ) )
						{
							if( newValue >= min )
							{
								el.val( newValue )
									.change( );
							}
						}
						else if( !$.isNumeric( min ) && $.isNumeric( max ) )
						{
							if( newValue <= max )
							{
								el.val( newValue )
									.change( );
							}
						} 
						else
						{
							el.val( newValue )
								.change( );
						}
					};
				
					// Обработчики в случае "активности" компонента
					if( !number.is( '.disabled' ) )
					{
						// Обработка клика на компонент
						number.on( 'mousedown', 'div.jq-number__spin', function( )
						{
							var spin = $( this );
							changeValue( spin );
							
							timeout = setTimeout( function( ) { interval = setInterval( function( ) { changeValue( spin ); }, 40 ); }, 350 );
						} )
						.on( 'mouseup mouseout', 'div.jq-number__spin', function( )
						{
							clearTimeout( timeout );
							clearInterval( interval );
						} );
						
						// Фокусировка
						el.on( 'focus.' + pluginName, function( )
						{
							number.addClass( 'focused' );
						} )
						.on( 'blur.' + pluginName, function( )
						{
							number.removeClass( 'focused' );
						} );
					}
					
					// Мы установили стиль, уведомляем об изменении
					el.change( );
				}; 
				
				// Стилизируем компонент
				numberOutput( );
				
				// Обновление при динамическом изменении
				el.on( 'refresh', function( )
				{
					// Убираем стилизацию компонента
					el.off( '.' + pluginName )
						.closest( '.jq-number' ).before( el ).remove( );
				
					// Стилизируем компонент снова
					numberOutput( );
				} );
			} 
			// Список
			else if( el.is( 'select' ) )
			{
				var selectboxOutput = function( )
				{
					// запрещаем прокрутку страницы при прокрутке селекта
					function preventScrolling( selector )
					{
						selector.off( 'mousewheel DOMMouseScroll' ).on( 'mousewheel DOMMouseScroll', function( e )
						{
							var scrollTo = null;
							
							if( e.type === 'mousewheel' )
							{
								scrollTo = ( e.originalEvent.wheelDelta * -1 );
							}
							else if( e.type === 'DOMMouseScroll' )
							{
								scrollTo = 40 * e.originalEvent.detail;
							}
							
							if( scrollTo )
							{
								e.stopPropagation( );
								e.preventDefault( );
								$( this ).scrollTop( scrollTo + $( this ).scrollTop( ) );
							}
						} );
					}
				
					var option = $( 'option', el );
					
					// Формируем список селекта
					function makeList( )
					{
						var list = '';
						
						for( var i = 0; i < option.length; i++ )
						{
							var op = option.eq( i ),
								li = '',
								liClass = '',
								liClasses = '',
								id = '',
								title = '',
								dataList = '',
								optionClass = '',
								optGroupClass = '',
								dataJqfsClass = '',
								disabled = 'disabled',
								selDis = 'selected sel disabled';
						
							if( op.is( ':selected' ) )
							{
								liClass = 'selected sel';
							}
							
							if( op.is( ':disabled' ) )
							{
								liClass = disabled;
							}
							
							if( op.is( ':selected:disabled' ) )
							{
								liClass = selDis;
							}
							
							if( op.attr( 'id' ) !== undefined && op.attr( 'id' ) !== '' )
							{
								id = ' id="' + op.attr( 'id' ) + idSuffix + '"';
							}
							
							if( op.attr( 'title' ) !== undefined && option.attr( 'title' ) !== '' )
							{
								title = ' title="' + op.attr( 'title' ) + '"';
							}
							
							if( op.attr( 'class' ) !== undefined )
							{
								optionClass = ' ' + op.attr( 'class' );
								dataJqfsClass = ' data-jqfs-class="' + op.attr( 'class' ) + '"';
							}
				
							var data = op.data( );
							for( var k in data )
							{
								if( data[k] !== '' )
								{
									dataList += ' data-' + k + '="' + data[k] + '"';
								}
							}
				
							if( ( liClass + optionClass ) !== '' )
							{
								liClasses = ' class="' + liClass + optionClass + '"';
							}
							
							li = '<li' + dataJqfsClass + dataList + liClasses + title + id + '>' + op.html( ) + '</li>';
				
							// Если есть optgroup
							if( op.parent( ).is( 'optgroup' ) )
							{
								if( op.parent( ).attr( 'class' ) !== undefined )
								{
									optGroupClass = ' ' + op.parent( ).attr( 'class' );
								}
								
								li = '<li' + dataJqfsClass + dataList + ' class="' + liClass + optionClass + ' option' + optGroupClass + '"' + title + id + '>' + op.html( ) + '</li>';
								if( op.is( ':first-child' ) )
								{
									li = '<li class="optgroup' + optGroupClass + '">' + op.parent( ).attr( 'label' ) + '</li>' + li;
								}
							}
				
							list += li;
						}
						
						return list;
					}
				
					// Одиночный селект
					function doSelect( )
					{
						var att = new Attributes( ),
							searchHTML = '',
							selectPlaceholder = el.data( 'placeholder' ),
							selectSearch = el.data( 'search' ),
							selectSearchLimit = el.data( 'search-limit' ),
							selectSearchNotFound = el.data( 'search-not-found' ),
							selectSearchPlaceholder = el.data( 'search-placeholder' ),
							singleSelectzIndex = el.data( 'z-index' ),
							selectSmartPositioning = el.data( 'smart-positioning' );
				
						if( selectPlaceholder === undefined )
						{
							selectPlaceholder = opt.selectPlaceholder;
						}
						
						if( selectSearch === undefined || selectSearch === '' )
						{
							selectSearch = opt.selectSearch;
						}
						
						if( selectSearchLimit === undefined || selectSearchLimit === '' )
						{
							selectSearchLimit = opt.selectSearchLimit;
						}
						
						if( selectSearchNotFound === undefined || selectSearchNotFound === '' )
						{
							selectSearchNotFound = opt.selectSearchNotFound;
						}
						
						if( selectSearchPlaceholder === undefined )
						{
							selectSearchPlaceholder = opt.selectSearchPlaceholder;
						}
						
						if( singleSelectzIndex === undefined || singleSelectzIndex === '' )
						{
							singleSelectzIndex = opt.singleSelectzIndex;
						}
						
						if( selectSmartPositioning === undefined || selectSmartPositioning === '' )
						{
							selectSmartPositioning = opt.selectSmartPositioning;
						}
				
						// Формируем компонент
						var selectbox = $( '<div class="jq-selectbox jqselect">' +
											'<div class="jq-selectbox__select" style="position: relative">' +
											'<div class="jq-selectbox__select-text"></div>' +
											'<div class="jq-selectbox__trigger">' +
											'<div class="jq-selectbox__trigger-arrow"></div></div>' +
											'</div>' +
											'</div>' )
											.css( { display: 'inline-block',
													position: 'relative',
													zIndex: singleSelectzIndex } )
											.attr( { id: att.id,
													title: att.title } )
											.addClass( att.classes )
											.data( att.data );
				
						//
						el.css( { margin: 0, padding: 0 } )
							.after( selectbox ).prependTo( selectbox );
				
						//
						var divSelect = $( 'div.jq-selectbox__select', selectbox ),
							divText = $( 'div.jq-selectbox__select-text', selectbox ),
							optionSelected = option.filter( ':selected' );
				
						// Формируем список
						var list = makeList( );
				
						//
						if( selectSearch )
						{
							searchHTML = '<div class="jq-selectbox__search"><input type="search" autocomplete="off" placeholder="' + selectSearchPlaceholder + '"></div>' +
											'<div class="jq-selectbox__not-found">' + selectSearchNotFound + '</div>';
						}
						
						//
						var dropdown = $( '<div class="jq-selectbox__dropdown" style="position: absolute">' +
											searchHTML +
											'<ul style="position: relative; list-style: none; overflow: auto; overflow-x: hidden">' + list + '</ul>' +
											'</div>' );
						
						//
						selectbox.append( dropdown );
						
						//
						var ul = $( 'ul', dropdown ),
							li = $( 'li', dropdown ),
							search = $( 'input', dropdown ),
							notFound = $( 'div.jq-selectbox__not-found', dropdown ).hide( );
					
						if( li.length < selectSearchLimit )
						{
							search.parent( ).hide( );
						}
				
						// Показываем опцию по умолчанию
						// Если 1-я опция пустая и выбрана по умолчанию, то показываем плейсхолдер
						if( optionSelected.text( ) === '' )
						{
							divText.text( selectPlaceholder )
									.addClass( 'placeholder' );
						}
						else
						{
							divText.text( optionSelected.text( ) );
						}
				
						// Определяем самый широкий пункт селекта
						var liWidthInner = 0,
							liWidth = 0;
					
						//
						li.css( { 'display': 'inline-block' } );
					
						//
						li.each( function( )
						{
							var l = $( this );
							
							if( l.innerWidth( ) > liWidthInner )
							{
								liWidthInner = l.innerWidth( );
								liWidth = l.width( );
							}
						} );
						
						//
						li.css( { 'display': '' } );
				
						// Подстраиваем ширину свернутого селекта в зависимости
						// от ширины плейсхолдера или самого широкого пункта
						if( divText.is( '.placeholder' ) && ( divText.width( ) > liWidthInner ) )
						{
							divText.width( divText.width( ) );
						}
						else
						{
							// Клонируем селектор и устанавливаем ему размер "авто"
							var selClone = selectbox.clone( ).appendTo( 'body' )
													.width( 'auto' );
							
							// Записываем размер клона
							var	selCloneWidth = selClone.outerWidth( );
						
							// Удаляем клон
							selClone.remove( );
							
							// 
							if( selCloneWidth === selectbox.outerWidth( ) )
							{
								divText.width( liWidth );
							}
						}
				
						// Подстраиваем ширину выпадающего списка в зависимости от самого широкого пункта
						if( liWidthInner > selectbox.width( ) )
						{
							dropdown.width( liWidthInner );
						}
				
						// Прячем 1-ю пустую опцию, если она есть и если атрибут data-placeholder не пустой
						// если все же нужно, чтобы первая пустая опция отображалась, то указываем у селекта: data-placeholder=""
						if( option.first( ).text( ) === '' && el.data( 'placeholder' ) !== '' )
						{
							li.first( ).hide( );
						}
				
						// прячем оригинальный селект
						el.css( {
							position: 'absolute',
							left: 0,
							top: 0,
							width: '100%',
							height: '100%',
							opacity: 0
						} );
				
						var selectHeight = selectbox.outerHeight( true ),
							searchHeight = search.parent( ).outerHeight( true ),
							isMaxHeight = ul.css( 'max-height' ),
							liSelected = li.filter( '.selected' ),
							position = dropdown.css( 'top' );
						
						if( li.data( 'li-height' ) === undefined )
						{
							li.data( 'li-height', li.outerHeight( ) );
						}
				
						if( dropdown.css( 'left' ) === 'auto' )
						{
							dropdown.css( {	left: 0 } );
						}
						
						if( dropdown.css( 'top' ) === 'auto' )
						{
							dropdown.css( { top: selectHeight } );
						}
						
						// 
						dropdown.hide( );
				
						// Если выбран не дефолтный пункт
						if( liSelected.length )
						{
							// Добавляем класс, показывающий изменение селекта
							if( option.first( ).text( ) !== optionSelected.text( ) )
							{
								selectbox.addClass( 'changed' );
							}
							
							// Передаем селекту класс выбранного пункта
							selectbox.data( 'jqfs-class', liSelected.data( 'jqfs-class' ) );
							selectbox.addClass( liSelected.data( 'jqfs-class' ) );
						}
				
						// Если селект неактивный
						if( el.is( ':disabled' ) )
						{
							selectbox.addClass( 'disabled' );
							return false;
						}
				
						// Клик по псевдоблоку
						divSelect.click( function( )
						{
							// Колбек при закрытии селекта
							if( $( 'div.jq-selectbox' ).filter( '.opened' ).length )
							{
								opt.onSelectClosed.call( $( 'div.jq-selectbox' ).filter( '.opened' ) );
							}
				
							// Фокусируем
							el.focus( );
				
							// Если iOS, то не показываем выпадающий список,
							// т.к. отображается нативный и неизвестно, как его спрятать
							if( Android || iOS )
							{
								return;
							}
				
							// Умное позиционирование
							var win = $( window ),
								liHeight = li.data( 'li-height' ),
								topOffset = selectbox.offset( ).top,
								bottomOffset = win.height( ) - selectHeight - ( topOffset - win.scrollTop( ) ),
								visible = el.data( 'visible-options' ),
								minHeight = liHeight * 5,
								newHeight = liHeight * visible;
							
							if( visible === undefined || visible === '' )
							{
								visible = opt.selectVisibleOptions;
							}			
							
							if( visible > 0 && visible < 6 )
							{
								minHeight = newHeight;
							}
							
							if( visible === 0 )
							{
								newHeight = 'auto';
							}
							
							//
							var dropDown = function( )
							{			
								//
								var maxHeightBottom = function( )
								{
									ul.css( 'max-height', Math.floor( ( bottomOffset - 20 - searchHeight ) / liHeight ) * liHeight );
								};
								
								//
								dropdown.height( 'auto' )
										.css( { bottom: 'auto', top: position } );
								
								// 
								maxHeightBottom( );
								
								//
								ul.css( 'max-height', newHeight );
								
								//
								if( isMaxHeight !== 'none' )
								{
									ul.css( 'max-height', isMaxHeight );
								}
								
								//
								if( bottomOffset < ( dropdown.outerHeight( ) + 20 ) )
								{
									maxHeightBottom( );
								}
							};
				
							//
							var dropUp = function( )
							{
								//
								var maxHeightTop = function( )
								{
									ul.css( 'max-height', Math.floor( ( topOffset - win.scrollTop( ) - 20 - searchHeight ) / liHeight ) * liHeight );
								};
								
								//
								dropdown.height( 'auto' )
										.css( { top: 'auto', bottom: position } );
								
								//
								maxHeightTop( );
								
								//
								ul.css( 'max-height', newHeight );
								
								//
								if( isMaxHeight !== 'none' )
								{
									ul.css( 'max-height', isMaxHeight );
								}
								
								if( ( topOffset - win.scrollTop( ) - 20 ) < ( dropdown.outerHeight( ) + 20 ) )
								{
									maxHeightTop( );
								}
							};
				
							if( selectSmartPositioning === true || selectSmartPositioning === 1 )
							{
								// Раскрытие вниз
								if( bottomOffset > ( minHeight + searchHeight + 20 ) )
								{
									dropDown( );
									selectbox.removeClass( 'dropup' ).addClass( 'dropdown' );
									
								} 
								// Раскрытие вверх
								else
								{
									dropUp( );
									selectbox.removeClass( 'dropdown' ).addClass( 'dropup' );
								}
							} 
							else if( selectSmartPositioning === false || selectSmartPositioning === 0 )
							{
								// Раскрытие вниз
								if( bottomOffset > ( minHeight + searchHeight + 20 ) )
								{
									dropDown( );
									selectbox.removeClass( 'dropup' ).addClass( 'dropdown' );
								}
							}
				
							// Если выпадающий список выходит за правый край окна браузера,
							// то меняем позиционирование с левого на правое
							if( selectbox.offset( ).left + dropdown.outerWidth( ) > win.width( ) )
							{
								dropdown.css( { left: 'auto', right: 0 } );
							}
				
							// 
							$( 'div.jqselect' ).css( { zIndex: ( singleSelectzIndex - 1 ) } )
												.removeClass( 'opened' );
							
							//
							selectbox.css( { zIndex: singleSelectzIndex } );
							
							//
							if( dropdown.is( ':hidden' ) )
							{
								$( 'div.jq-selectbox__dropdown:visible' ).hide( );
								
								// Отображаем список
								dropdown.show( );
								
								// Добавляем классы
								selectbox.addClass( 'opened focused' );
								
								// Колбек при открытии селекта
								opt.onSelectOpened.call( selectbox );
							}
							else
							{
								// Скрываем список
								dropdown.hide( );
								
								// Удаляем классы
								selectbox.removeClass( 'opened dropup dropdown' );
								
								// Колбек при закрытии селекта
								if( $( 'div.jq-selectbox' ).filter( '.opened' ).length )
								{
									opt.onSelectClosed.call( selectbox );
								}
							}
				
							// Поисковое поле
							if( search.length )
							{
								// Сбрасываем значение и начинаем поиск
								search.val( '' )
										.keyup( );
								
								// Прячем блок "не найдено"
								notFound.hide( );
								
								// Начинаем поиск после "отжатия кнопки"
								search.keyup( function( )
								{
									var query = $( this ).val( );
									
									// Проходим по содержимому
									li.each( function( )
									{
										if( !$( this ).html( ).match( new RegExp( '.*?' + query + '.*?', 'i' ) ) )
										{
											$( this ).hide( );
										} 
										else
										{
											$( this ).show( );
										}
									} );
									
									// Прячем 1-ю пустую опцию
									if( option.first( ).text( ) === '' && el.data( 'placeholder' ) !== '' )
									{
										li.first( ).hide( );
									}
									
									if( li.filter( ':visible' ).length < 1 )
									{
										notFound.show( );
									}
									else
									{
										notFound.hide( );
									}
								} );
							}
				
							// Прокручиваем до выбранного пункта при открытии списка
							if( li.filter( '.selected' ).length )
							{
								if( el.val( ) === '' )
								{
									ul.scrollTop( 0 );
								}
								else
								{
									// Если нечетное количество видимых пунктов,
									// то высоту пункта делим пополам для последующего расчета
									if( ( ul.innerHeight( ) / liHeight ) % 2 !== 0 )
									{
										liHeight = liHeight / 2;
									}
									
									ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected' ).position( ).top - ul.innerHeight( ) / 2 + liHeight );
								}
							}
				
							preventScrolling( ul );
				
						} );
				
						// При наведении курсора на пункт списка
						li.hover( function( )
						{
							$( this ).siblings( ).removeClass( 'selected' );
						} );
						
						// 
						var selectedText = li.filter( '.selected' ).text( );
				
						// При клике на пункт списка
						li.filter( ':not(.disabled):not(.optgroup)' ).click( function( )
						{
							//
							var t = $( this ),
								liText = t.text( );
								
							// Фокусируем
							el.focus( );
											
							//
							if( !t.is( '.selected' ) )
							{
								var index = t.index( );
									index -= t.prevAll( '.optgroup' ).length;
									
								t.addClass( 'selected sel' ).siblings( ).removeClass( 'selected sel' );
								option.prop( 'selected', false ).eq( index ).prop( 'selected', true );
								
								selectedText = liText;
								divText.text( liText );
				
								// Передаем селекту класс выбранного пункта
								if( selectbox.data( 'jqfs-class' ) )
								{
									selectbox.removeClass( selectbox.data( 'jqfs-class' ) );
								}
								
								selectbox.data( 'jqfs-class', t.data( 'jqfs-class' ) );
								selectbox.addClass( t.data( 'jqfs-class' ) );
				
								el.change( );
							}
							
							dropdown.hide( );
							selectbox.removeClass( 'opened dropup dropdown' );
							
							// Колбек при закрытии селекта
							opt.onSelectClosed.call( selectbox );
				
						} );
						
						//
						dropdown.mouseout( function( )
						{
							$( 'li.sel', dropdown ).addClass( 'selected' );
						} );
				
						// Изменение селекта
						el.on( 'change.' + pluginName, function( )
						{
							divText.text( option.filter( ':selected' ).text( ) )
									.removeClass( 'placeholder' );
							
							li.removeClass( 'selected sel' )
								.not( '.optgroup' ).eq( el[0].selectedIndex ).addClass( 'selected sel' );
							
							// Добавляем класс, показывающий изменение селекта
							if( option.first( ).text( ) !== li.filter( '.selected' ).text( ) )
							{
								selectbox.addClass( 'changed' );
							}
							else
							{
								selectbox.removeClass( 'changed' );
							}
						} )
						// Фокусировка
						.on( 'focus.' + pluginName, function( )
						{
							selectbox.addClass( 'focused' );
							
							$( 'div.jqselect' ).not( '.focused' ).removeClass( 'opened dropup dropdown' )
												.find( 'div.jq-selectbox__dropdown' ).hide( );
						} )
						// Расфокусировка
						.on( 'blur.' + pluginName, function( )
						{
							selectbox.removeClass( 'focused' );
						} )
						// Изменение селекта с клавиатуры
						.on( 'keydown.' + pluginName + ' keyup.' + pluginName, function( e )
						{
							var liHeight = li.data( 'li-height' );
							
							if( el.val( ) === '' )
							{
								divText.text( selectPlaceholder ).addClass( 'placeholder' );
							}
							else
							{
								divText.text( option.filter( ':selected' ).text( ) );
							}
							
							li.removeClass( 'selected sel' ).not( '.optgroup' ).eq( el[0].selectedIndex ).addClass( 'selected sel' );
							
							// Вверх, влево, Page Up, Home
							if( e.which === 38 || e.which === 37 || e.which === 33 || e.which === 36 )
							{
								if( el.val( ) === '' )
								{
									ul.scrollTop( 0 );
								}
								else
								{
									ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected' ).position( ).top );
								}
							}
							// Вниз, вправо, Page Down, End
							if( e.which === 40 || e.which === 39 || e.which === 34 || e.which === 35 )
							{
								ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected' ).position( ).top - ul.innerHeight( ) + liHeight );
							}
							
							// Закрываем выпадающий список при нажатии Enter
							if( e.which === 13 )
							{
								e.preventDefault( );
								dropdown.hide( );
								selectbox.removeClass( 'opened dropup dropdown' );
								
								// Колбек при закрытии селекта
								opt.onSelectClosed.call( selectbox );
							}
						} )
						//
						.on( 'keydown.' + pluginName, function( e )
						{
							// Открываем выпадающий список при нажатии Space
							if( e.which === 32 )
							{
								e.preventDefault( );
								divSelect.click( );
							}
						} );
				
						// Прячем выпадающий список при клике за пределами селекта
						if( !onDocumentClick.registered )
						{
							$( document ).on( 'click', onDocumentClick );
							onDocumentClick.registered = true;
						}
				
					}
				
					// Мультиселект
					function doMultipleSelect( )
					{
						var att = new Attributes( ),
							selectbox = $( '<div class="jq-select-multiple jqselect"></div>' )
										.css( {	display: 'inline-block',
												position: 'relative' } )
										.attr( { id: att.id,
												title: att.title } )
										.addClass( att.classes )
										.data( att.data );
				
						// Формируем псевдоблок
						el.css( { margin: 0, padding: 0 } )
							.after( selectbox );
				
						// Формируем список
						var list = makeList( );
						
						// Добавляем список
						selectbox.append( '<ul>' + list + '</ul>' );
						
						var ul = $( 'ul', selectbox ).css( {
								'position': 'relative',
								'overflow-x': 'hidden',
								'-webkit-overflow-scrolling': 'touch' 
							} ),
							li = $( 'li', selectbox ).attr( 'unselectable', 'on' ),
							size = el.attr( 'size' ),
							ulHeight = ul.outerHeight( ),
							liHeight = li.outerHeight( );
						
						if( size !== undefined && size > 0 )
						{
							ul.css( { 'height': liHeight * size } );
						} 
						else
						{
							ul.css( { 'height': liHeight * 4 } );
						}
						
						if( ulHeight > selectbox.height( ) )
						{
							ul.css( 'overflowY', 'scroll' );
							preventScrolling( ul );
							
							// Прокручиваем до выбранного пункта
							if( li.filter( '.selected' ).length )
							{
								ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected' ).position( ).top );
							}
						}
				
						// Прячем оригинальный селект
						el.prependTo( selectbox ).css( {
							position: 'absolute',
							left: 0,
							top: 0,
							width: '100%',
							height: '100%',
							opacity: 0
						} );
				
						// Если селект неактивный
						if( el.is( ':disabled' ) )
						{
							selectbox.addClass( 'disabled' );
							
							option.each( function( )
							{
								if( $( this ).is( ':selected' ) )
								{
									li.eq( $( this ).index( ) ).addClass( 'selected' );
								}
							} );
						}
						// Если селект активный
						else
						{
							// При клике на пункт списка
							li.filter( ':not(.disabled):not(.optgroup)' ).click( function( e )
							{
								el.focus( );
								
								var clkd = $( this );
								
								if( !e.ctrlKey && !e.metaKey )
								{
									clkd.addClass( 'selected' );
								}
								
								if( !e.shiftKey )
								{
									clkd.addClass( 'first' );
								}
								
								if( !e.ctrlKey && !e.metaKey && !e.shiftKey )
								{
									clkd.siblings( ).removeClass( 'selected first' );
								}
				
								// Выделение пунктов при зажатом Ctrl
								if( e.ctrlKey || e.metaKey )
								{
									if( clkd.is( '.selected' ) )
									{
										clkd.removeClass( 'selected first' );
									}
									else
									{
										clkd.addClass( 'selected first' );
									}
									
									clkd.siblings( ).removeClass( 'first' );
								}
				
								// Выделение пунктов при зажатом Shift
								if( e.shiftKey )
								{
									var prev = false,
										next = false;
										
									clkd.siblings( ).removeClass( 'selected' )
										.siblings( '.first' ).addClass( 'selected' );
									
									clkd.prevAll( ).each( function( )
									{
										if( $( this ).is( '.first' ) )
										{
											prev = true;
										}
									} );
									
									clkd.nextAll( ).each( function( )
									{
										if( $( this ).is( '.first' ) )
										{
											next = true;
										}
									} );
									
									if( prev )
									{
										clkd.prevAll( ).each( function( )
										{
											if( $( this ).is( '.selected' ) )
											{
												return false;
											}
											else
											{
												$( this ).not( '.disabled, .optgroup' ).addClass( 'selected' );
											}
										} );
									}
									
									if( next )
									{
										clkd.nextAll( ).each( function( )
										{
											if( $( this ).is( '.selected' ) )
											{
												return false;
											}
											else
											{
												$( this ).not( '.disabled, .optgroup' ).addClass( 'selected' );
											}
										} );
									}
									
									if( li.filter( '.selected' ).length === 1 )
									{
										clkd.addClass( 'first' );
									}
								}
				
								// Отмечаем выбранные мышью
								option.prop( 'selected', false );
								
								//
								li.filter( '.selected' ).each( function( )
								{
									var t = $( this ),
										index = t.index( );
									
									if( t.is( '.option' ) )
									{
										index -= t.prevAll( '.optgroup' ).length;
									}
									
									option.eq( index ).prop( 'selected', true );
								} );
								
								el.change( );
				
							} );
				
							// Отмечаем выбранные с клавиатуры
							option.each( function( i )
							{
								$( this ).data( 'optionIndex', i );
							} );
							
							//
							el.on( 'change.' + pluginName, function( )
							{
								li.removeClass( 'selected' );
								
								var arrIndexes = [ ];
								
								option.filter( ':selected' ).each( function( )
								{
									arrIndexes.push( $( this ).data( 'optionIndex' ) );
								} );
								
								li.not( '.optgroup' ).filter( function( i )
								{
									return $.inArray( i, arrIndexes ) > -1;
								} )
								.addClass( 'selected' );
							} )
							//
							.on( 'focus.' + pluginName, function( )
							{
								selectbox.addClass( 'focused' );
							} )
							//
							.on( 'blur.' + pluginName, function( )
							{
								selectbox.removeClass( 'focused' );
							} );
				
							// прокручиваем с клавиатуры
							if( ulHeight > selectbox.height( ) )
							{
								el.on( 'keydown.' + pluginName, function( e )
								{
									// вверх, влево, PageUp
									if( e.which === 38 || e.which === 37 || e.which === 33 )
									{
										ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected' ).position( ).top - liHeight );
									}
									// вниз, вправо, PageDown
									if( e.which === 40 || e.which === 39 || e.which === 34 )
									{
										ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected:last' ).position( ).top - ul.innerHeight( ) + liHeight * 2 );
									}
								} );
							}
				
						}
					}
				
					if( el.is( '[multiple]' ) )
					{
						// если Android или iOS, то мультиселект не стилизуем
						// причина для Android: в стилизованном селекте нет возможности выбрать несколько пунктов
						// причина для iOS: в стилизованном селекте неправильно отображаются выбранные пункты
						if( Android || iOS )
						{
							return;
						}
				
						doMultipleSelect( );
					} 
					else
					{
						doSelect( );
					}
				};
				
				// Стилизируем компонент
				selectboxOutput( );
				
				// Обновление при динамическом изменении
				el.on( 'refresh', function( )
				{
					// Убираем стилизацию компонента
					el.off( '.' + pluginName )
						.parent( ).before( el ).remove( );
				
					// Стилизируем компонент снова
					selectboxOutput( );
				} );
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
			
				el.closest( 'label' )
					.add( 'label[for="' + el.attr( 'id' ) + '"]' )
					.off( '.' + pluginName );
			}
			//
			else if( el.is( 'input[type="number"]' ) )
			{
				el.off( '.' + pluginName + ' refresh' )
					.closest( '.jq-number' ).before( el ).remove( );
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
	
		// определяем общего родителя у радиокнопок с одинаковым name
		// http://stackoverflow.com/a/27733847
		$.fn.commonParents = function( )
		{
			var cachedThis = this;
			
			return cachedThis.first( ).parents( ).filter( function( )
			{
				return $( this ).find( cachedThis ).length === cachedThis.length;
			} );
		};
		
		$.fn.commonParent = function( )
		{
			return $( this ).commonParents( ).first( );
		};
	
		// Прячем выпадающий список при клике за пределами селекта
		function onDocumentClick( e )
		{
			// e.target.nodeName != 'OPTION' - добавлено для обхода бага в Opera на движке Presto
			// (при изменении селекта с клавиатуры срабатывает событие onclick)
			if( !$( e.target ).parents( ).hasClass( 'jq-selectbox' ) && e.target.nodeName !== 'OPTION' )
			{
				if( $( 'div.jq-selectbox.opened' ).length )
				{
					//
					var selectbox = $( 'div.jq-selectbox.opened' ),
						search = $( 'div.jq-selectbox__search input', selectbox ),
						dropdown = $( 'div.jq-selectbox__dropdown', selectbox ),
						opt = selectbox.find( 'select' ).data( '_' + pluginName ).options;
	
					// колбек при закрытии селекта
					opt.onSelectClosed.call( selectbox );
	
					//
					if( search.length )
					{
						search.val( '' ).keyup( );
					}
					
					//
					dropdown.hide( )
							.find( 'li.sel' ).addClass( 'selected' );
					
					//
					selectbox.removeClass( 'focused opened dropup dropdown' );
				}
			}
		}
		
		onDocumentClick.registered = false;
} ) );