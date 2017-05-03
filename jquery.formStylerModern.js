/**
 * jquery.formstyler-modern - JQuery HTML form styling plugin
 * @version v1.5.3
 * @link https://github.com/ange007/JQueryFormStyler-Modern
 * @license MIT
 * @author Borisenko Vladimir
 */

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

	var pluginName = 'styler',	/* Имя плагина. 
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
				var checkboxOutput = function( el )
				{
					//
					var att = new Attributes( el ),
						parent = el.parent( ),
						checkbox = $( '<div class="jq-checkbox"><div class="jq-checkbox__div"></div></div>' )
									.attr( { 'id': att.id, 'title': att.title, 'unselectable': 'on' } )
									.addClass( att.classes )
									.data( att.data );
				
					// Прячем оригинальный чекбокс
					el.addClass( 'jq-hidden' )
						.after( checkbox ).prependTo( checkbox );
					
					// Необходимо "перерисовать" контрол 
					checkbox.on( 'repaint', function( )
					{
						// Отмечено
						if( el.is( ':checked' ) || el.is( ':indeterminate' ) )
						{
							if( el.is( ':indeterminate' ) )
							{
								checkbox.removeClass( 'checked' )
										.addClass( 'indeterminate' );
							}
							else
							{
								checkbox.removeClass( 'indeterminate' )
										.addClass( 'checked' );
							}
						}
						// Не отмечено
						else
						{
							checkbox.removeClass( 'indeterminate' )
									.removeClass( 'checked' );
						}
						
						// Активация/деактивация
						checkbox.toggleClass( 'disabled', el.is( ':disabled' ) );
					} )	
					// Клик по псевдоблоку ( смена состояния )
					.on( 'click', function( e )
					{
						e.preventDefault( );
				
						// Обрабатываем только активный псевдобокс
						if( !checkbox.is( '.disabled' ) )
						{
							// Текущее состояние: "Отмечено"
							if( el.is( ':checked' ) || el.is( ':indeterminate' ) )
							{
								// ... если работаем через 3 состояния - отмечаем "не определено",  или просто снимаем отметку
								el.prop( 'checked', ( opt.checkboxIndeterminate && el.is( ':indeterminate' ) ) );
				
								// "Неопределено" в любом случае снимаем
								el.prop( 'indeterminate', false );
							}
							// Текущее состояние: "Не отмечено"
							else
							{
								// ... если работаем через 3 состояния - отмечаем "не определено"
								if( opt.checkboxIndeterminate )
								{
									el.prop( 'checked', false )
										.prop( 'indeterminate', true );
								}
								// ... или просто отмечаем
								else
								{
									el.prop( 'checked', true )
										.prop( 'indeterminate', false );
								}
							}
							
							// Фокусируем и изменяем вызываем состояние изменения
							el.focus( )
								.trigger( 'change' )
								.triggerHandler( 'click' );
						}
					} );
				
					// Клик по label привязанному к данному checkbox
					el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' )
										.on( 'click.' + pluginName, function( e )
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
						checkbox.triggerHandler( 'repaint' );
					} )
					// Обработка переключения при помощи клавиатуры
					.on( 'keydown.' + pluginName, function( e )
					{
						if( e.which === 32 )
						{
							e.preventDefault( );
							checkbox.triggerHandler( 'click' );
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
					checkbox.triggerHandler( 'repaint' );
				};
				
				// Стилизируем компонент
				checkboxOutput( element );
			}
			// Радиокнопка
			else if( element.is( ':radio' ) )
			{
				var radioOutput = function( el )
				{
					var att = new Attributes( el ),
						radio = $( '<div class="jq-radio"><div class="jq-radio__div"></div></div>' )
								.attr( { 'id': att.id, 'title': att.title, 'unselectable': 'on' } )
								.addClass( att.classes )
								.data( att.data );
				
					// Прячем оригинальную радиокнопку
					el.addClass( 'jq-hidden' )
						.after( radio ).prependTo( radio );
					
					// Необходимо "перерисовать" контрол 
					radio.on( 'repaint', function( )
					{
						// Отметка
						el.parent( ).toggleClass( 'checked', el.is( ':checked' ) );
				
						// Активация/деактивация
						radio.toggleClass( 'disabled', el.is( ':disabled' ) );
					} )
					// Клик по псевдоблоку
					.on( 'click', function( e )
					{
						//
						e.preventDefault( );
				
						// Обрабатываем только активную радиокнопку
						if( !radio.is( '.disabled' ) )
						{
							//
							var name = el.attr( 'name' );
							
							// Ищем нужный нам елемент в блоке который указан в настройках ( по умолчанию form )
							var findElement = radio.closest( opt.wrapper )
													.find( 'input[name="' + name + '"]:radio' );
				
							// ... если не нашли - ищем по родителям
							if( findElement.length <= 0 )
							{
								findElement = radio.closest( '#' + name )
													.find( 'input[name="' + name + '"]:radio' );
							}
				
							// ... или же по всему документу
							if( findElement.length <= 0 )
							{
								findElement = $( 'body' ).find( 'input[name="' + name + '"]:radio' );
							}
				
							// Снимаем отметку с найденного блока
							findElement.prop( 'checked', false )
									.parent( ).removeClass( 'checked' );			
				
							// Передаём фокус и вызываем событие - изменения
							el.prop( 'checked', true )
								.focus( )
								.trigger( 'change' )
								.triggerHandler( 'click' );
						}
					} );
				
					// Обработка изменений
					el.on( 'change.' + pluginName, function( e )
					{
						radio.triggerHandler( 'repaint' );
					} )
					// Обработка переключения при помощи клавиатуры
					.on( 'keydown.' + pluginName, function( e )
					{
						if( e.which === 32 )
						{
							e.preventDefault( );
							radio.trigger( 'click' );
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
					radio.triggerHandler( 'repaint' );
				};
				
				// Стилизируем компонент
				radioOutput( element );
			}
			// Выбор файла
			else if ( element.is( ':file' ) ) 
			{
				//
				var fileOutput = function( el )
				{
					var att = new Attributes( el ), 
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
								.attr( { 'id': att.id, 'title': att.title } )
								.addClass( att.classes )
								.data( att.data );
					
					// Прячем оригинальное поле
					el.addClass( 'jq-hidden' )
						.after( file ).appendTo( file );
				
					// Необходимо "перерисовать" контрол 
					file.on( 'repaint', function( )
					{
						var value = el.val( ),
							name = $('div.jq-file__name', file);
								
						// 
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
								
						// Выводим название файлов или примечание
						name.text( value.replace( /.+[\\\/]/, '' ) || placeholder );
						
						// Активация/деактивация
						file.toggleClass( 'changed', ( value !== '' ) );
						
						// Активация/деактивация
						file.toggleClass( 'disabled', el.is( ':disabled' ) );
					} );
				
					// Обработка "изменения" состояния
					el.on( 'change.' + pluginName, function( )
					{
						file.triggerHandler( 'repaint' );
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
					file.triggerHandler( 'repaint' );
				};
				
				// Стилизируем компонент
				fileOutput( element );
			}
			// Номер
			else if( element.is( 'input[type="number"]' ) )
			{
				var numberOutput = function( el )
				{
					// Формируем компонент
					var att = new Attributes( el ),
						number = $( '<div class="jq-number">'
										+ '<div class="jq-number__spin minus"></div>'
										+ '<div class="jq-number__spin plus"></div>'
									+ '</div>' )
							.attr( { 'id': att.id, 'title': att.title } )
							.addClass( att.classes )
							.data( att.data );
					
					// Добавляем нужные блоки
					el.after( number ).prependTo( number )
										.wrap( '<div class="jq-number__field"></div>' );
					
					// Инициализируем переменные
					var min = el.attr( 'min' ) || undefined,
						max = el.attr( 'max' ) || undefined,
						step = Number( el.attr( 'step' ) ) || 1,
						timeout = null,
						interval = null;
				
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
				
					// Необходимо "перерисовать" контрол
					number.on( 'repaint', function( )
					{
						// Активация/деактивация
						number.toggleClass( 'disabled', el.is( ':disabled' ) );
					} )
					//
					.on( 'mousedown', 'div.jq-number__spin', function( )
					{
						if( el.is( ':disabled' ) )
						{
							return;
						}
						
						var spin = $( this );
						changeValue( spin );
				
						timeout = setTimeout( function( ) { interval = setInterval( function( ) { changeValue( spin ); }, 40 ); }, 350 );
					} )
					//
					.on( 'mouseup mouseout', 'div.jq-number__spin', function( )
					{
						if( el.is( ':disabled' ) )
						{
							return;
						}
						
						clearTimeout( timeout );
						clearInterval( interval );
					} );
				
					// Фокусировка
					el.on( 'focus.' + pluginName, function( )
					{
						number.addClass( 'focused' );
					} )
					// Расфокусировка
					.on( 'blur.' + pluginName, function( )
					{
						number.removeClass( 'focused' );
					} );
					
					// Мы установили стиль, уведомляем об изменении
					number.triggerHandler( 'repaint' );
				}; 
				
				// Стилизируем компонент
				numberOutput( element );
			} 
			// Пароль
			else if( element.is('input[type="password"]' ) ) 
			{
				var passwordOutput = function( el )
				{
					//
					var button = $( '<div class="jq-password__switch">' + opt.passwordSwitchHtml + '</div>' ),
						password = $( '<div class="jq-password">' ).append( button ),
						customButton = ( button.children( 'button' ).length > 0 ?  button.children( 'button' ) : button );
					
					// Есть ли текст в блоке, и нужно ли его ставить
					if( customButton.html( ) === '' && opt.passwordShow !== '' )
					{
						customButton.html( opt.passwordShow );
									
						// Если был вставлен только текст
						if( button.children( 'button' ).length <= 0 )
						{
							button.addClass( 'jq-password__switch-text' );
						}	
					}
				
					//
					el.after( password ).prependTo( password );
				
					// Необходимо "перерисовать" контрол
					password.on( 'repaint', function( )
					{
						// Активация/деактивация
						password.toggleClass( 'disabled', el.is( ':disabled' ) );
						
						// Активация/деактивация кнопки
						customButton.prop( 'disabled', el.is( ':disabled' ) );
					} )	
					// Реакция на клик по кнопке
					.on( 'click', '.jq-password__switch', function( ) 
					{
						var switcher = $( this ),
							wrapper = switcher.closest( '.jq-password' ),
							seen = wrapper.is( '.jq-password_seen' );
				
						// Добавление/удаление класса
						wrapper.toggleClass( 'jq-password_seen', !seen );
				
						// Меняем текст
						if( opt.passwordShow !== '' && opt.passwordHide !== '' )
						{
							customButton.html( seen ? opt.passwordShow : opt.passwordHide );
						}
						
						//
						el.attr( 'type', ( seen ? 'password' : 'text' ) );
					} );
					
					// Фокусировка
					el.on( 'focus.' + pluginName, function( )
					{
						password.addClass( 'focused' );
					} )
					// Расфокусировка
					.on( 'blur.' + pluginName, function( )
					{
						password.removeClass( 'focused' );
					} );
					
					// Мы установили стиль, уведомляем об изменении
					password.triggerHandler( 'repaint' );
				}; 
				
				// Стилизируем компонент
				passwordOutput( element );
			}
			// Скрытое поле
			else if( element.is( 'input[type="hidden"]' ) )
			{
				return false;
			}
			// Список
			else if( element.is( 'select' ) )
			{
				var selectboxOutput = function( el )
				{
					//
					var optionList = $( 'option', el );
					
					// Прячем выпадающий список при клике за пределами селекта
					function onDocumentClick( e )
					{
						// e.target.nodeName != 'OPTION' - добавлено для обхода бага в Opera на движке Presto
						// (при изменении селекта с клавиатуры срабатывает событие onclick)
						if( !$( e.target ).parents( ).hasClass( 'jq-selectbox' ) && e.target.nodeName !== 'OPTION' )
						{
							if( $( 'div.jq-selectbox.opened' ).length > 0 )
							{
								//
								var selectbox = $( 'div.jq-selectbox.opened' ),
									search = $( 'div.jq-selectbox__search input', selectbox ),
									dropdown = $( 'div.jq-selectbox__dropdown', selectbox ),
									opt = selectbox.find( 'select' ).data( '_' + pluginName ).options;
				
								// Колбек при закрытии селекта
								opt.onSelectClosed.call( selectbox );
				
								//
								if( search.length > 0 )
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
					
					//
					onDocumentClick.registered = false;
					
					// Запрещаем прокрутку страницы при прокрутке селекта
					function preventScrolling( selector )
					{
						var scrollDiff = selector.prop( 'scrollHeight' ) - selector.outerHeight( ),
							wheelDelta = null,
							scrollTop = null;
				
						selector.off( 'mousewheel DOMMouseScroll' )
								.on( 'mousewheel DOMMouseScroll', function (e)
						{
							wheelDelta = ( e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0 ) ? 1 : -1; // Направление прокрутки (-1 вниз, 1 вверх)
							scrollTop = selector.scrollTop( ); // Позиция скролла
				
							if( ( scrollTop >= scrollDiff && wheelDelta < 0 ) || ( scrollTop <= 0 && wheelDelta > 0 ) ) 
							{
								e.stopPropagation( );
								e.preventDefault( );
							}
				
						} );
					}
					
					// Формируем список селекта
					function makeList( opList )
					{
						var list = $( '<ul>' );
						
						//
						for( var i = 0; i < opList.length; i++ )
						{
							var op = opList.eq( i ),
								liClass = op.attr( 'class' ) || '',
								id = ( op.attr( 'id' ) || '' ) !== '' ? ( op.attr( 'id' ) + idSuffix ) : '',
								title = op.attr( 'title' );
						
							if( op.is( ':selected' ) )
							{
								liClass += ( liClass !== '' ? ' ' : '' ) + 'selected sel';
							}
							
							if( op.is( ':disabled' ) )
							{
								liClass += ( liClass !== '' ? ' ' : '' ) + 'disabled';
							}
							
							// Параметры по умолчанию
							var defaultAttr = { 'title': title,
												'data': op.data( ),
												'html': op.html( ) };
											
							// Добавляем к пункту идентификатор если он есть
							if( id !== '' )
							{
								defaultAttr[ 'id' ] = id;
							}
										
							// Если есть optgroup
							if( op.parent( ).is( 'optgroup' ) )
							{
								var optGroupClass = '';
								
								//
								if( op.parent( ).attr( 'class' ) !== undefined )
								{
									optGroupClass = ' ' + op.parent( ).attr( 'class' );
								}
												
								// Заголовок группы
								if( op.is( ':first-child' ) )
								{
									$( '<li>', { 'class': 'optgroup' + optGroupClass,
												'html': op.parent( ).attr( 'label' ) } )
									.appendTo( list );
								}
								
								// Создаём пункт для группы
								$( '<li>', $.extend( defaultAttr, { 'class': 'option' } ) )
									.addClass( liClass )
									.addClass( optGroupClass )
									.data( 'jqfs-class', op.attr( 'class' ) )
									.appendTo( list );
							}
							else
							{
								// Создаём пункт
								$( '<li>', defaultAttr )
									.addClass( liClass )	
									.data( 'jqfs-class', op.attr( 'class' ) )
									.appendTo( list );
							}
						}
						
						return list;
					}
				
					// Одиночный селект
					function doSelect( el )
					{
						//
						var att = new Attributes( el ),
							ulList = makeList( optionList ),
							searchHTML = '',
							selectPlaceholder = el.data( 'placeholder' ) || opt.selectPlaceholder,
							selectSearch = el.data( 'search' ) || opt.selectSearch,
							selectSearchLimit = el.data( 'search-limit' ) || opt.selectSearchLimit,
							selectSearchNotFound = el.data( 'search-not-found' ) || opt.selectSearchNotFound,
							selectSearchPlaceholder = el.data( 'search-placeholder' ) || opt.selectSearchPlaceholder,
							singleSelectzIndex = el.data( 'z-index' ) || opt.singleSelectzIndex,
							selectSmartPositioning = el.data( 'smart-positioning' ) || opt.selectSmartPositioning;
						
						// Блок поиска
						if( selectSearch )
						{
							searchHTML = '<div class="jq-selectbox__search"><input type="search" autocomplete="off" placeholder="' + selectSearchPlaceholder + '"></div>'
										+ '<div class="jq-selectbox__not-found">' + selectSearchNotFound + '</div>';
						}
						
						// Выпадающий список
						var dropdown = $( '<div class="jq-selectbox__dropdown" style="position: absolute">'
											+ searchHTML
										+ '</div>' )
										.append( ulList );
						
						// Формируем компонент
						var selectbox = $( '<div class="jq-selectbox jqselect">'
												+ '<div class="jq-selectbox__select">'
													+ '<div class="jq-selectbox__select-text"></div>'
													+ '<div class="jq-selectbox__trigger">'
														+ opt.selectTriggerHtml
													+ '</div>'
											+ '</div></div>' )
											.css( {	zIndex: singleSelectzIndex } )
											.attr( { 'id': att.id, 'title': att.title } )
											.data( att.data )
											.addClass( att.classes )
											.append( dropdown );
				
						// Вставляем оригинальный элемент в псевдоблок
						el.after( selectbox ).prependTo( selectbox );
				
						// Разбираем на составляющие 
						var divSelect = $( 'div.jq-selectbox__select', selectbox ),
							divText = $( 'div.jq-selectbox__select-text', selectbox ),
							optionSelected = optionList.filter( ':selected' );
						
						// Разбираем на составляющие выпадающий список
						var menu = $( 'ul', dropdown ),
							li = $( 'li', dropdown ).css( { 'display': 'inline-block' } ),
							search = $( 'input', dropdown ),
							notFound = $( 'div.jq-selectbox__not-found', dropdown ).hide( ),
							liWidthInner = 0,
							liWidth = 0;
					
						//
						if( li.length < selectSearchLimit )
						{
							search.parent( ).hide( );
						}
				
						// Расчитываем максимальную ширину
						li.each( function( )
						{
							var l = $( this );
							
							if( l.innerWidth( ) > liWidthInner )
							{
								liWidthInner = l.innerWidth( );
								liWidth = l.width( );
							}
						} );
						
						// Убираем инлайновый стиль
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
						if( optionList.first( ).text( ) === '' && el.data( 'placeholder' ) !== '' )
						{
							li.first( ).hide( );
						}
				
						// Прячем оригинальный селект
						el.addClass( 'jq-hidden' );
				
						//
						var selectHeight = selectbox.outerHeight( true ) || 0,
							searchHeight = search.parent( ).outerHeight( true ) || 0,
							isMaxHeight = menu.css( 'max-height' ) || 0,
							liSelected = li.filter( '.selected' ),
							position = selectHeight || 0;
						
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
							if( optionList.first( ).text( ) !== optionSelected.text( ) )
							{
								selectbox.addClass( 'changed' );
							}
							
							// Передаем селекту класс выбранного пункта
							selectbox.data( 'jqfs-class', liSelected.data( 'jqfs-class' ) );
							selectbox.addClass( liSelected.data( 'jqfs-class' ) );
						}
				
						// Необходимо "перерисовать" контрол
						selectbox.on( 'repaint', function( )
						{
							//
							var selectedItems = optionList.filter( ':selected' ),
								disabledItems = optionList.filter( ':disabled' );
				
							// Выводим в тексте выбранный элемент
							if( selectedItems.val( ) === '' )
							{
								divText.html( selectPlaceholder )
										.addClass( 'placeholder' );
							}
							else
							{
								divText.html( selectedItems.text( ) )
										.removeClass( 'placeholder' );
							}
				
							// Удаляем ранее установленный "спец. класс"
							if( selectbox.data( 'jqfs-class' ) )
							{
								selectbox.removeClass( selectbox.data( 'jqfs-class' ) );
							}
				
							// Передаем селекту класс выбранного пункта
							selectbox.data( 'jqfs-class', selectedItems.attr( 'class' ) );
							selectbox.addClass( selectedItems.attr( 'class' ) );	
				
							// Ставим класс отметки
							li.removeClass( 'selected sel' )
								.not( '.optgroup' ).eq( el[0].selectedIndex ).addClass( 'selected sel' );
						
							// Отметка деактивации на пунктах
							li.removeClass( 'disabled' )
								.not( '.optgroup' )
								.filter( function( index ) { return optionList.eq( index ).is( ':disabled' ); } )
								.addClass( 'disabled' );
						
							// Добавляем класс, показывающий изменение селекта
							selectbox.toggleClass( 'changed', ( optionList.first( ).text( ) !== li.filter( '.selected' ).text( ) ) );
				
							// Активация/деактивация
							selectbox.toggleClass( 'disabled', el.is( ':disabled' ) );
						} );
						
						// Клик по псевдоблоку
						divSelect.on( 'click', function( )
						{
							// Клик должен срабатывать только при активном контроле
							if( el.is( ':disabled' ) )
							{
								return;
							}
							
							//
							if( !dropdown.is( ':hidden' ) )
							{
								// Скрываем список
								dropdown.hide( );
								
								// Удаляем классы
								selectbox.removeClass( 'opened dropup dropdown' );
								
								// Колбек при закрытии селекта
								if( $( 'div.jq-selectbox' ).filter( '.opened' ).length > 0 )
								{
									opt.onSelectClosed.call( selectbox );
								}
								
								return;
							}
							
							//
							// $( 'div.jq-selectbox__dropdown:visible' ).hide( );
				
							// Отображаем список
							dropdown.show( );
				
							// Добавляем классы
							selectbox.addClass( 'opened focused' );
				
							// Колбек при открытии селекта
							opt.onSelectOpened.call( selectbox );
							
							// Колбек при закрытии селекта
							/*if( $( 'div.jq-selectbox' ).filter( '.opened' ).length )
							{
								opt.onSelectClosed.call( $( 'div.jq-selectbox' ).filter( '.opened' ) );
							}*/
				
							// Фокусируем
							el.focus( );
				
							// Если iOS, то не показываем выпадающий список,
							// т.к. отображается нативный и неизвестно, как его спрятать
							if( iOS )
							{
								return;
							}
				
							// Умное позиционирование
							var win = $( window ),
								liHeight = li.data( 'li-height' ) || 0,
								topOffset = selectbox.offset( ).top || 0,
								bottomOffset = win.height( ) - selectHeight - ( topOffset - win.scrollTop( ) ),
								visible = el.data( 'visible-options' ) || opt.selectVisibleOptions,
								minHeight = ( visible > 0 && visible < 6 ) ? newHeight : liHeight * 5,
								newHeight = ( visible === 0 ) ? 'auto' : liHeight * visible;
							
							// Выпадающее вниз меню
							// @todo: Как-то тут много "магии"
							var dropDown = function( menu )
							{			
								//
								var maxHeightBottom = function( )
								{
									menu.css( 'max-height', Math.floor( ( bottomOffset - searchHeight - liHeight ) / liHeight ) * liHeight );
								};
								
								// Сначала высчитываем максимальную высоту
								maxHeightBottom( );
								
								// Если есть конкретная высота - выставляем её
								menu.css( 'max-height', ( isMaxHeight !== 'none' && isMaxHeight > 0 ? isMaxHeight : newHeight ) );
								
								// Если высота больше чем нужно - снова ставим максммальную
								if( bottomOffset < ( dropdown.outerHeight( ) + liHeight ) )
								{
									maxHeightBottom( );
								}
							};
				
							// Выпадающее вверх меню
							// @todo: Как-то тут много "магии"
							var dropUp = function( menu )
							{
								//
								var maxHeightTop = function( )
								{
									menu.css( 'max-height', Math.floor( ( topOffset - win.scrollTop( ) - liHeight - searchHeight ) / liHeight ) * liHeight );
								};
				
								// Сначала высчитываем максимальную высоту
								maxHeightTop( );
								
								// Если есть конкретная высота - выставляем её
								menu.css( 'max-height', ( isMaxHeight !== 'none' && isMaxHeight > 0 ? isMaxHeight : newHeight ) );
								
								// Если высота больше чем нужно - снова ставим максммальную
								if( ( topOffset - win.scrollTop( ) - liHeight ) < ( dropdown.outerHeight( ) + liHeight ) )
								{
									maxHeightTop( );
								}
							};
				
							//
							if( selectSmartPositioning === true || selectSmartPositioning === 1 )
							{
								// Раскрытие вниз
								if( bottomOffset > ( minHeight + searchHeight + 20 ) )
								{
									dropDown( menu );
									
									selectbox.removeClass( 'dropup' )
												.addClass( 'dropdown' );
									
								} 
								// Раскрытие вверх
								else
								{
									dropUp( menu );
									
									selectbox.removeClass( 'dropdown' )
												.addClass( 'dropup' );
								}
							}
							else if( selectSmartPositioning === false || selectSmartPositioning === 0 )
							{
								// Раскрытие вниз
								if( bottomOffset > ( minHeight + searchHeight + 20 ) )
								{
									dropDown( menu );
									
									selectbox.removeClass( 'dropup' )
												.addClass( 'dropdown' );
								}
							}
				
							// Если выпадающий список выходит за правый край окна браузера,
							// то меняем позиционирование с левого на правое
							if( selectbox.offset( ).left + dropdown.outerWidth( ) > win.width( ) )
							{
								dropdown.css( { left: 'auto', right: 0 } );
							}
				
							// Видимые селекты "отбрасываем" за z-index открывающегося select
							$( 'div.jqselect' ).css( { zIndex: ( singleSelectzIndex - 1 ) } )/*
												.removeClass( 'opened' )*/;
							
							//
							selectbox.css( { zIndex: singleSelectzIndex } );
							
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
									
									// Проходим по содержимому и ищем нужные элементы
									li.each( function( )
									{
										var find = !$( this ).html( ).match( new RegExp( '.*?' + query + '.*?', 'i' ) );
										
										$( this ).toggle( !find );
									} );
									
									// Прячем 1-ю пустую опцию
									if( optionList.first( ).text( ) === '' && el.data( 'placeholder' ) !== '' )
									{
										li.first( ).hide( );
									}
									
									// Показать "не найдено"
									notFound.toggle( ( li.filter( ':visible' ).length < 1 ) );
								} );
							}
				
							// Прокручиваем до выбранного пункта при открытии списка
							if( li.filter( '.selected' ).length )
							{
								if( el.val( ) === '' )
								{
									menu.scrollTop( 0 );
								}
								else
								{
									// Если нечетное количество видимых пунктов,
									// то высоту пункта делим пополам для последующего расчета
									if( ( menu.innerHeight( ) / liHeight ) % 2 !== 0 )
									{
										liHeight = liHeight / 2;
									}
									
									menu.scrollTop( menu.scrollTop( ) + li.filter( '.selected' ).position( ).top - menu.innerHeight( ) / 2 + liHeight );
								}
							}
				
							preventScrolling( menu );
				
						} );
				
						// 
						var selectedText = li.filter( '.selected' ).text( );
				
						// При наведении курсора на пункт списка
						li.on( 'hover', function( )
						{
							$( this ).siblings( ).removeClass( 'selected' );
						} )	
						// При клике на пункт визуального списка
						.on( 'click', function( )
						{
							var selected = $( this );
							
							// Если пункт не активен или заголовок - не пускаем дальше
							if( selected.is( '.disabled, .optgroup' ) )
							{
								return;
							}
								
							// Фокусируем
							el.focus( );
											
							//
							if( !selected.is( '.selected' ) )
							{
								var index = selected.index( );
									index -= selected.prevAll( '.optgroup' ).length;
				
								//
								optionList.prop( 'selected', false )
											.eq( index ).prop( 'selected', true );
				
								//
								el.change( );
							}
							
							// Прячем список
							dropdown.hide( );
							selectbox.removeClass( 'opened dropup dropdown' );
							
							// Колбек при закрытии селекта
							opt.onSelectClosed.call( selectbox );
				
						} );
						
						//
						dropdown.on( 'mouseout', function( )
						{
							$( 'li.sel', dropdown ).addClass( 'selected' );
						} );
				
						// Реакция на смену пункта оригинального селекта
						el.on( 'change.' + pluginName, function( )
						{
							selectbox.triggerHandler( 'repaint' );
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
				
							// Вверх, влево, Page Up, Home
							if( e.which === 38 || e.which === 37 || e.which === 33 || e.which === 36 )
							{
								if( el.val( ) === '' )
								{
									menu.scrollTop( 0 );
								}
								else
								{
									menu.scrollTop( menu.scrollTop( ) + li.filter( '.selected' ).position( ).top );
								}
							}
							// Вниз, вправо, Page Down, End
							if( e.which === 40 || e.which === 39 || e.which === 34 || e.which === 35 )
							{
								menu.scrollTop( menu.scrollTop( ) + li.filter( '.selected' ).position( ).top - menu.innerHeight( ) + liHeight );
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
						
						// Мы установили стиль, уведомляем об изменении
						selectbox.triggerHandler( 'repaint' );
					}
				
					// Мультиселект
					function doMultipleSelect( el )
					{
						var att = new Attributes( el ),
							ulList = makeList( optionList ),
							selectbox = $( '<div class="jq-select-multiple jqselect"></div>' )
										.attr( { 'id': att.id, 'title': att.title } )
										.addClass( att.classes )
										.data( att.data )
										.append( ulList );
					
						// Формируем псевдоблок
						el.after( selectbox ).prependTo( selectbox );
					
						//
						var ul = $( 'ul', selectbox ),
							li = $( 'li', selectbox ).attr( 'unselectable', 'on' ),
							size = el.attr( 'size' ) || 4,
							ulHeight = ul.outerHeight( ) || 0,
							liHeight = li.outerHeight( ) || 0;
					
						//
						ul.css( { 'height': liHeight * size } );
					
						// 
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
						el.addClass( 'jq-hidden' );
						
						// Необходимо "перерисовать" контрол
						selectbox.on( 'repaint', function( )
						{
							var arrIndexes = [ ];
							optionList.filter( ':selected' )
										.each( function( ) { arrIndexes.push( $( this ).data( 'optionIndex' ) ); } );
							
							//
							li.removeClass( 'selected' )
								.not( '.optgroup' )
								// .filter( function( index ) { return optionList.eq( index ).is( ':selected' ); } )
								.filter( function( i ) { return $.inArray( i, arrIndexes ) > -1; } )
								.addClass( 'selected' );
						
							// Отметка деактивации на пунктах
							li.removeClass( 'disabled' )
								.not( '.optgroup' )
								.filter( function( index ) { return optionList.eq( index ).is( ':disabled' ); } )
								.addClass( 'disabled' );
					
							// Активация/деактивация
							selectbox.toggleClass( 'disabled', el.is( ':disabled' ) );
						} );
					
						// При клике на пункт списка
						li.click( function( e )
						{
							var selected = $( this );
							
							// Клик должен срабатывать только при активном контроле
							if( el.is( ':disabled' ) || selected.is( '.disabled, .optgroup' ) )
							{
								return;
							}
							
							// Фокусируем
							el.focus( );
					
							//
							if( !e.ctrlKey && !e.metaKey )
							{
								selected.addClass( 'selected' );
							}
					
							//
							if( !e.shiftKey )
							{
								selected.addClass( 'first' );
							}
					
							//
							if( !e.ctrlKey && !e.metaKey && !e.shiftKey )
							{
								selected.siblings( ).removeClass( 'selected first' );
							}
					
							// Выделение пунктов при зажатом Ctrl
							if( e.ctrlKey || e.metaKey )
							{
								selected.toggleClass( 'selected first', !selected.is( '.selected' ) );
								selected.siblings( ).removeClass( 'first' );
							}
					
							// Выделение пунктов при зажатом Shift
							if( e.shiftKey )
							{
								var prev = false,
									next = false;
					
								//
								selected.siblings( ).removeClass( 'selected' )
										.siblings( '.first' ).addClass( 'selected' );
					
								//
								selected.prevAll( ).each( function( ) {	prev = ( prev || $( this ).is( '.first' ) ); } );
								selected.nextAll( ).each( function( ) {	next = ( next || $( this ).is( '.first' ) ); } );
					
								//
								if( prev )
								{
									selected.prevAll( ).each( function( )
									{
										if( $( this ).is( '.selected' ) ) {	return false; }
										else { $( this ).not( '.disabled, .optgroup' ).addClass( 'selected' );	}
									} );
								}
					
								//
								if( next )
								{
									selected.nextAll( ).each( function( )
									{
										if( $( this ).is( '.selected' ) ) {	return false; }
										else { $( this ).not( '.disabled, .optgroup' ).addClass( 'selected' ); }
									} );
								}
					
								if( li.filter( '.selected' ).length === 1 )
								{
									selected.addClass( 'first' );
								}
							}
					
							// Отмечаем выбранные мышью
							optionList.prop( 'selected', false );
					
							//
							li.filter( '.selected' ).each( function( )
							{
								var t = $( this ),
									index = t.index( ) - ( t.is( '.option' ) ? t.prevAll( '.optgroup' ).length : 0 );
					
								optionList.eq( index ).prop( 'selected', true );
							} );
					
							//
							el.change( );
						} );
					
						// Отмечаем выбранные с клавиатуры
						optionList.each( function( i )
						{
							$( this ).data( 'optionIndex', i );
						} );
					
						// Реакция на смену пункта оригинального селекта
						el.on( 'change.' + pluginName, function( )
						{
							selectbox.triggerHandler( 'repaint' );
						} )
						// Фокусировка
						.on( 'focus.' + pluginName, function( )
						{
							selectbox.addClass( 'focused' );
						} )
						// Расфокусировка
						.on( 'blur.' + pluginName, function( )
						{
							selectbox.removeClass( 'focused' );
						} );
					
						// Прокручиваем с клавиатуры
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
						
						// Мы установили стиль, уведомляем об изменении
						selectbox.triggerHandler( 'repaint' );
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
				
						doMultipleSelect( el );
					} 
					else
					{
						if( el.attr( 'size' ) > 1 ) { doMultipleSelect( el ); }
						else { doSelect( el ); }
					}
				};
				
				// Стилизируем компонент
				selectboxOutput( element );
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
	
		// Определяем общего родителя у радиокнопок с одинаковым name
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
} ) );