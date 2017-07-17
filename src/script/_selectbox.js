let SelectBox = 
( function( )
{
	let Component = function( element, options, locale ) 
	{
		//
		this.element = element;
		this.options = options;
		this.locale = locale;
				
		//
		this.ajaxOptions = options.search.ajax;
		this.ajaxData = { term: '', page: 0 };
		this.ajaxTimeout = undefined;

		//
		const attr = new Attributes( this.element );
		
		// Поле поиска
		this.searchBlock = $( '<div class="jq-selectbox__search">'
									+ '<input type="search" autocomplete="off" placeholder="' + ( element.data( 'search-placeholder' ) || locale.search[ 'placeholder' ] ) + '">'
								+ '</div>'
								+ '<div class="jq-selectbox__not-found">' + ( element.data( 'search-not-found' ) || locale.search[ 'notFound' ] ) + '</div>' )
							.hide( );
	
		// Выпадающий список
		this.dropdown = $( '<div class="jq-selectbox__dropdown" style="position: absolute">'
								+ '<ul></ul>'
							+ '</div>' )
							.prepend( this.searchBlock );
	
		// Формируем компонент
		this.selectbox = $( '<div class="jq-selectbox jqselect">'
								+ '<div class="jq-selectbox__select">'
									+ '<div class="jq-selectbox__select-text"></div>'
									+ '<div class="jq-selectbox__trigger">'
										+ ( options.triggerHTML || '' )
									+ '</div>'
							+ '</div></div>' )
							.attr( { 'id': attr.id, 'title': attr.title } )
							.data( attr.data )
							.addClass( attr.classes )
							.append( this.dropdown );

		// Вставляем оригинальный элемент в псевдоблок
		element.after( this.selectbox ).prependTo( this.selectbox );

		// Разбираем на составляющие 
		this.selectboxSelect = $( 'div.jq-selectbox__select', this.selectbox );
		this.selectboxText = $( 'div.jq-selectbox__select-text', this.selectbox );

		// Загрузка выпадающего списка
		this.loadDropdown( );
		
		// Скрываем список
		this.dropdown.hide( );
		
		//
		this.setEvents( )
			.repaint( );

		// Прячем оригинальный селект
		element.addClass( 'jq-hidden' );
	};
	
	Component.prototype = 
	{
		// Загрузка выпадающего списка
		loadDropdown: function( )
		{
			const element = this.element,
				options = this.options,
				locale = this.locale,
				selectbox = this.selectbox,
				dropdown = this.dropdown,
				searchBlock = this.searchBlock;
		
			//
			const optionList = $( 'option', element ),
				optionSelected = optionList.filter( ':selected' ),
				ulList = SelectBoxExtra.makeList( optionList ),
				searchEnabled = !element.data( 'search' ) || options.search,
				searchLimit = element.data( 'search-limit' ) || ( options.search || {} ).limit,
				notFound = $( 'div.jq-selectbox__not-found', dropdown );
		
			// Заменяем содержимое списка
			dropdown.find( 'ul' ).replaceWith( ulList );
			
			//
			const dropdownLi = $( 'li', dropdown ).css( { 'display': 'inline-block' } ),
				liSelected = dropdownLi.filter( '.selected' );
		
			//
			if( dropdown.css( 'left' ) === 'auto' )
			{
				dropdown.css( {	left: 0 } );
			}
		
			// Обновляем ширину
			this.calculateDropdownWidth( );

			// Обновляем высоту
			this.calculateDropdownHeight( );

			// Добавляем поле поиска
			if( ( dropdownLi.length > searchLimit || ( this.ajaxOptions !== undefined && this.ajaxOptions.url !== '' ) ) )
			{
				searchBlock.show( );
				
				// "Не найдено"
				notFound.toggle( dropdownLi.filter( ':visible' ).length < 1 );
			}
			else
			{
				searchBlock.hide( );
			}

			// Если выбран не дефолтный пункт
			if( liSelected.length )
			{
				// Добавляем класс, показывающий изменение селекта
				if( optionList.first( ).text( ) !== optionSelected.text( ) )
				{
					selectbox.addClass( 'changed' );
				}

				// Передаем селекту класс выбранного пункта
				selectbox.data( 'jqfs-class', liSelected.data( 'jqfs-class' ) )
						.addClass( liSelected.data( 'jqfs-class' ) );
			}
			
			return this;
		},
		
		// Закрыватие списка
		closeDropdown: function( )
		{		
			const element = this.element,
				options = this.options,
				selectbox = this.selectbox,
				dropdown = this.dropdown;
		
			// Прячем список
			dropdown.hide( );
			selectbox.removeClass( 'opened dropup dropdown' );

			// Колбек при закрытии селекта
			options.onClosed.call( selectbox );	
		   
			return this;
		},
		
		//
		openDropdown: function( )
		{
			const element = this.element,
				options = this.options,
				selectbox = this.selectbox,
				dropdown = this.dropdown,
				dropdownSearch = this.searchBlock.find( 'input' );
			
			//
			const notFound = $( 'div.jq-selectbox__not-found', dropdown );
			
			// 
			$( 'div.jqselect' ).removeClass( 'opened' );

			//
			$( 'div.jq-selectbox__dropdown:visible' ).hide( );

			// Добавляем классы
			selectbox.addClass( 'opened focused' );		

			// Отображаем список
			dropdown.show( );

			//
			this.smartPosition( );

			// Поисковое поле
			if( dropdownSearch.parent( ).is( ':visible' ) )
			{
				// Сбрасываем значение и начинаем поиск
				dropdownSearch.trigger( 'focus' );

				// Прячем блок "не найдено"
				notFound.hide( );
			}

			// Колбек при открытии селекта
			options.onOpened.call( selectbox );
			
			return this;
		},
		
		// Расчёт ширины
		calculateDropdownWidth: function( )
		{
			const element = this.element,
				selectbox = this.selectbox,
				selectboxText = this.selectboxText,
				dropdown = this.dropdown;
		
			// Разбираем на составляющие выпадающий список
			const dropdownLi = $( 'li', dropdown );
			
			//
			let	liWidthInner = 0,
				liWidth = 0;

			// Расчитываем максимальную ширину
			dropdownLi.each( function( )
			{
				let item = $( this );

				if( item.innerWidth( ) > liWidthInner )
				{
					liWidthInner = item.innerWidth( );
					liWidth = item.width( );
				}
			} );

			// Убираем инлайновый стиль
			dropdownLi.css( { 'display': '' } );

			// Подстраиваем ширину свернутого селекта в зависимости
			// от ширины плейсхолдера или самого широкого пункта
			if( selectboxText.is( '.placeholder' ) && ( selectboxText.width( ) > liWidthInner ) )
			{
				selectboxText.width( selectboxText.width( ) );
			}
			else
			{
				// Клонируем селектор и устанавливаем ему размер "авто"
				let selClone = selectbox.clone( ).appendTo( 'body' )
										.width( 'auto' );

				// Записываем размер клона
				let	selCloneWidth = selClone.outerWidth( );

				// Удаляем клон
				selClone.remove( );

				// 
				if( selCloneWidth === selectbox.outerWidth( ) )
				{
					selectboxText.width( liWidth );
				}
			}

			// Подстраиваем ширину выпадающего списка в зависимости от самого широкого пункта
			if( liWidthInner > selectbox.width( ) )
			{
				dropdown.width( liWidthInner );
			}

			// Прячем 1-ю пустую опцию, если она есть и если атрибут data-placeholder не пустой
			// если все же нужно, чтобы первая пустая опция отображалась, то указываем у селекта: data-placeholder=""
			if( $( 'option', element ).first( ).text( ) === '' && element.data( 'placeholder' ) !== '' )
			{
				dropdownLi.first( ).hide( );
			}
			
			return this;
		},
		
		// Расчёт высоты
		calculateDropdownHeight: function( )
		{
			const element = this.element,
				options = this.options,
				selectbox = this.selectbox,
				dropdown = this.dropdown;
				
			//
			const dropdownLi = $( 'li', dropdown );
			
			//
			if( dropdownLi.data( 'li-height' ) === undefined )
			{
				dropdownLi.data( 'li-height', dropdownLi.outerHeight( ) );
			}

			//
			if( dropdown.css( 'top' ) === 'auto' )
			{
				dropdown.css( { top: selectbox.outerHeight( true ) || 0 } );
			}
				
			return this;
		},
		
		// Умное позиционирование
		smartPosition: function( )
		{
			const element = this.element,
				options = this.options,
				ajaxOptions = this.ajaxOptions,
				selectbox = this.selectbox,
				dropdown = this.dropdown,
				dropdownSearch = this.searchBlock.find( 'input' );
			
			//
			const optionList = $( 'option', this.element ),
				selectSmartPosition = element.data( 'smart-position' ) || options.smartPosition;
			
			// Разбираем на составляющие выпадающий список
			const dropdownUl = $( 'ul', dropdown ),
				dropdownLi = $( 'li', dropdown ),
				notFound = $( 'div.jq-selectbox__not-found', dropdown ),
				itemCount = dropdownLi.length,
				selectHeight = selectbox.outerHeight( true ) || 0,
				maxHeight = dropdownUl.css( 'max-height' ) || 0,
				position = selectHeight || 0;
			
			// Умное позиционирование - переменные
			let liHeight = dropdownLi.data( 'li-height' ) || 0;

			// Умное позиционирование - константы
			const visible = element.data( 'visible-options' ) || options.visibleOptions,
				topOffset = selectbox.offset( ).top || 0,
				bottomOffset = $( window ).height( ) - selectHeight - ( topOffset - $( window ).scrollTop( ) ),
				searchHeight = dropdownSearch.parent( ).outerHeight( true ) || 0,
				newHeight = ( visible === 0 ) ? 'auto' : liHeight * visible,
				minHeight = ( visible > 0 && visible < 6 ) ? newHeight : liHeight * ( itemCount < 5 ? itemCount : 5 );

			// Раскрытие вверх
			if( selectSmartPosition && ( bottomOffset <= ( minHeight + searchHeight + liHeight ) ) )
			{
				this.dropUp( dropdownUl, topOffset, newHeight, liHeight, maxHeight );
			}
			// Раскрытие вниз
			else 
			{
				this.dropDown( dropdownUl, bottomOffset, newHeight, liHeight, maxHeight );
			}

			// Если выпадающий список выходит за правый край окна браузера,
			// то меняем позиционирование с левого на правое
			if( selectbox.offset( ).left + dropdown.outerWidth( ) > $( window ).width( ) )
			{
				dropdown.css( { left: 'auto', right: 0 } );
			}

			// Минимальная высота списка
			if( /*itemCount <= 0 &&*/dropdownUl.outerHeight( true ) < minHeight )
			{
				dropdownUl.css( 'min-height', minHeight );
			}

			// Прокручиваем до выбранного пункта при открытии списка
			if( dropdownLi.filter( '.selected' ).length )
			{
				if( element.val( ) === '' )
				{
					dropdownUl.scrollTop( 0 );
				}
				else
				{
					// Если нечетное количество видимых пунктов,
					// то высоту пункта делим пополам для последующего расчета
					if( ( dropdownUl.innerHeight( ) / liHeight ) % 2 !== 0 )
					{
						liHeight = liHeight / 2;
					}

					//
					dropdownUl.scrollTop( dropdownUl.scrollTop( ) + dropdownLi.filter( '.selected' ).position( ).top - dropdownUl.innerHeight( ) / 2 + liHeight );
				}
			}

			//
			SelectBoxExtra.preventScrolling( dropdownUl );
			
			return this;
		},
		
		// Выпадающее вниз меню
		// @todo: Как-то тут много "магии"
		dropDown: function( menu, offset, newHeight, liHeight, maxHeight )
		{	
			const searchHeight = $( 'input', this.dropdown ).parent( ).outerHeight( true ) || 0;

			//
			this.selectbox.removeClass( 'dropup' )
							.addClass( 'dropdown' );
			
			//
			const maxHeightBottom = function( )
			{
				menu.css( 'max-height', Math.floor( ( offset - searchHeight - liHeight ) / liHeight ) * liHeight );
			};

			// Сначала высчитываем максимальную высоту
			maxHeightBottom( );

			// Если есть конкретная высота - выставляем её
			menu.css( 'max-height', ( maxHeight !== 'none' && parseInt( maxHeight ) > 0 ? parseInt( maxHeight ) : newHeight ) );

			// Если высота больше чем нужно - снова ставим максммальную
			if( offset < ( this.dropdown.outerHeight( ) + liHeight ) )
			{
				maxHeightBottom( );
			}
			
			return this;
		},

		// Выпадающее вверх меню
		// @todo: Как-то тут много "магии"
		dropUp: function( menu, offset, newHeight, liHeight, maxHeight )
		{
			const searchHeight = $( 'input', this.dropdown ).parent( ).outerHeight( true ) || 0;
			
			//
			this.selectbox.removeClass( 'dropdown' )
							.addClass( 'dropup' );
			
			//
			const maxHeightTop = function( )
			{
				menu.css( 'max-height', Math.floor( ( offset - $( window ).scrollTop( ) - searchHeight - liHeight ) / liHeight ) * liHeight );
			};

			// Сначала высчитываем максимальную высоту
			maxHeightTop( );

			// Если есть конкретная высота - выставляем её
			menu.css( 'max-height', ( maxHeight !== 'none' && maxHeight > 0 ? maxHeight : newHeight ) );

			// Если высота больше чем нужно - снова ставим максммальную
			if( ( offset - $( window ).scrollTop( ) - liHeight ) < ( this.dropdown.outerHeight( ) + liHeight ) )
			{
				maxHeightTop( );
			}

			this.dropdown.css({
				top: 'auto'
			});
			
			return this;
		},
			
		// Обработка событий
		setEvents: function( )
		{
			const context = this,
				element = this.element,
				options = this.options,
				ajaxOptions = this.ajaxOptions,
				selectbox = this.selectbox,
				dropdown = this.dropdown,
				dropdownSearch = this.searchBlock.find( 'input' ),
				selectboxSelect = this.selectboxSelect;

			// Разбираем на составляющие выпадающий список
			const dropdownUl = $( 'ul', dropdown ),
				dropdownLi = $( 'li', dropdown ),
				notFound = $( 'div.jq-selectbox__not-found', dropdown );
			
			// Необходимо "перерисовать" контрол
			selectbox.on( 'repaint', function( )
			{
				context.repaint( );
			} )
			// Необходимо закрыть выпадающий список
			.on( 'dropdown:close', function( )
			{
				context.closeDropdown( );
			} )
			// Необходимо открыть выпадающий список
			.on( 'dropdown:open', function( )
			{
				context.openDropdown( );
			} );
			
			// Клик по псевдоблоку
			selectboxSelect.on( 'click', function( event )
			{
				// Клик должен срабатывать только при активном контроле
				if( element.is( ':disabled' ) )
				{
					return;
				}

				// Колбек при закрытии селекта
				if( $( 'div.jq-selectbox' ).filter( '.opened' ).length )
				{
					options.onClosed.call( $( 'div.jq-selectbox' ).filter( '.opened' ) );
				}

				// Фокусируем
				element.trigger( 'focus' );

				// Если iOS, то не показываем выпадающий список,
				// т.к. отображается нативный и неизвестно, как его спрятать
				if( iOS )
				{
					return;
				}
								
				// Выпадающий список скрыт
				if( dropdown.is( ':visible' ) )
				{
					selectbox.triggerHandler( 'dropdown:close' );
				}
				else
				{
					selectbox.triggerHandler( 'dropdown:open' );
				}
			} );
			
			// Начинаем поиск после "отжатия кнопки"
			dropdownSearch.on( 'keyup', function( )
			{
				const query = $( this ).val( ),
					optionList = $( 'option', context.element );

				// 
				if( ajaxOptions !== undefined && ajaxOptions.url !== '' )
				{
					if( query !== '' )
					{
						if( context.ajaxTimeout ) { window.clearTimeout( context.ajaxTimeout ); }
						context.ajaxTimeout = window.setTimeout( function( ) { context.ajaxSearch( query, true ); }, ajaxOptions.delay || 100 );
					}
					else
					{
						// Очищаем список
						element.find( 'option' ).remove( );
						
						// Перезагружаем список
						context.loadDropdown( );
					}
				}
				else
				{
					// Проходим по содержимому
					dropdownLi.each( function( )
					{
						const find = $( this ).html( )
											.match( new RegExp( '.*?' + query + '.*?', 'i' ) );

						//
						$( this ).toggle( find ? true : false );
					} );
				}

				// Прячем 1-ю пустую опцию
				if( optionList.first( ).text( ) === '' && element.data( 'placeholder' ) !== '' )
				{
					dropdownLi.first( ).hide( );
				}

				// Видимость блока "не найдено"
				notFound.toggle( dropdownLi.filter( ':visible' ).length < 1 );
			} );

			//
			dropdown.on( 'mouseout', function( )
			{
				$( 'li.sel', this ).addClass( 'selected' );
			} )
			// При наведении курсора на пункт списка
			.on( 'hover', 'li', function( )
			{
				$( this ).siblings( ).removeClass( 'selected' );
			} )	
			// При клике на пункт визуального списка
			.on( 'click', 'li', function( )
			{
				const selected = $( this ),
					optionList = $( 'option', context.element );

				// Если пункт не активен или заголовок - не пускаем дальше
				if( selected.is( '.disabled, .optgroup' ) )
				{
					return;
				}

				//
				if( !selected.is( '.selected' ) )
				{
					let index = selected.index( ) - selected.prevAll( '.optgroup' ).length;

					//
					optionList.prop( 'selected', false )
								.eq( index ).prop( 'selected', true );

					//
					element.change( );
				}

				// Прячем список
				selectbox.triggerHandler( 'dropdown:close' );
			} );

			// Реакция на смену пункта оригинального селекта
			element.on( 'change.' + pluginName, function( )
			{
				selectbox.triggerHandler( 'repaint' );
			} )
			// Фокусировка
			.on( 'focus.' + pluginName, function( )
			{
				selectbox.addClass( 'focused' );
			} )
			// Расфокусировка
			.on( 'blur.' + pluginName, function( event )
			{
				selectbox.removeClass( 'focused' );
			} )
			// Изменение селекта с клавиатуры
			.on( 'keydown.' + pluginName + ' keyup.' + pluginName, function( event )
			{
				//
				let liHeight = dropdownLi.data( 'li-height' );

				// Вверх, влево, Page Up, Home
				if( event.which === 38 || event.which === 37 || event.which === 33 || event.which === 36 )
				{
					if( element.val( ) === '' )
					{
						dropdownUl.scrollTop( 0 );
					}
					else
					{
						dropdownUl.scrollTop( dropdownUl.scrollTop( ) + dropdownLi.filter( '.selected' ).position( ).top );
					}
				}
				// Вниз, вправо, Page Down, End
				if( event.which === 40 || event.which === 39 || event.which === 34 || event.which === 35 )
				{
					dropdownUl.scrollTop( dropdownUl.scrollTop( ) + dropdownLi.filter( '.selected' ).position( ).top - dropdownUl.innerHeight( ) + liHeight );
				}

				// Закрываем выпадающий список при нажатии Enter
				if( event.which === 13 )
				{
					event.preventDefault( );
					
					// Прячем список
					selectbox.triggerHandler( 'dropdown:close' );
				}
			} )
			.on( 'keydown.' + pluginName, function( event )
			{				
				if( event.which === 32 )
				{
					//
					selectboxSelect.triggerHandler( 'click' );
					
					return false;
				}
			} );

			return this;
		},
		
		// Поиск на сервере
		ajaxSearch: function( term, clear )
		{
			const context = this,
				element = this.element,
				options = this.options,
				ajaxOptions = this.ajaxOptions;
		
			// Добавляем в данные поисковый запрос
			this.ajaxData.term = term;

			// Параметры по умолчанию
			const ajaxDefault = {
				type: 'GET',

				success: function( data, textStatus, jqXHR )
				{
					return context.ajaxSearchSuccess( data, clear );

				},
				error: function( data, textStatus, jqXHR )
				{
					// Очищаем при необходимости
					if( clear ) 
					{ 
						element.find( 'option' ).remove( );
						context.loadDropdown( );
					}
					
					if( context.options.debug && window.console && console.error ) 
					{
						console.error( 'JQuery.FormStyler-Modern: Ошибка при запросе!' );
					}
				} 
			};

			// Объеденяем настройки
			const requestOptions = $.extend( ajaxDefault, ajaxOptions );

			// Вызываем функцию
			if( typeof requestOptions.url === 'function' )
			{
				requestOptions.url = ajaxOptions.url.call( element, context.ajaxData );
			}

			// Вызываем функцию
			if( typeof requestOptions.data === 'function' )
			{
				requestOptions.data = ajaxOptions.data.call( element, context.ajaxData );
			}

			// Отправляем запрос
			$.ajax( requestOptions );
			
			return this;
		},
		
		// Обработка удачного ответа
		ajaxSearchSuccess: function( data, clear )
		{
			const context = this,
				element = this.element,
				options = this.options,
				ajaxOptions = this.ajaxOptions;
			
			// Обрабатываем результат
			var results = ajaxOptions.processResults( data, context.ajaxData );

			// Проверка массива с результатом
			if( this.options.debug && window.console && console.error ) 
			{
				if( !results || !results.items || !$.isArray( results.items ) )
				{
					console.error( 'JQuery.FormStyler-Modern: В ответе не найдены данные по ключу - `items`.' );
				}
			}
			
			// Очищаем при необходимости
			if( clear )	{ element.find( 'option' ).remove( ); }

			// Считываем список элементов
			var items = results.items || results;

			// Выводим список
			$( items ).each( function( index, item ) 
			{
				$( '<option>' ).val( item.value || item.id || index )
								.text( item.caption || item.name || item.text || item )
								.appendTo( element );
			} );

			// Обновляем выпадающий список
			this.loadDropdown( );
			
			//
			this.smartPosition( );
			
			return this;
		},
		
		// Перерисовка
		repaint: function( )
		{
			const element = this.element,
				options = this.options,
				selectbox = this.selectbox,
				dropdown = this.dropdown,
				selectboxText = this.selectboxText;
			
			//
			const optionList = $( 'option', element ),
				li = $( 'li', dropdown );
			
			//
			const selectedItems = optionList.filter( ':selected' );

			// Выводим в тексте выбранный элемент
			if( selectedItems.val( ) === undefined || selectedItems.val( ) === '' )
			{
				selectboxText.html( element.data( 'placeholder' ) || options.placeholder )
							.addClass( 'placeholder' );
			}
			else
			{
				selectboxText.html( selectedItems.html( ) )
							.removeClass( 'placeholder' );
			}

			// Удаляем ранее установленный "спец. класс"
			if( selectbox.data( 'jqfs-class' ) )
			{
				selectbox.removeClass( selectbox.data( 'jqfs-class' ) );
			}

			// Передаем селекту класс выбранного пункта
			selectbox.data( 'jqfs-class', selectedItems.attr( 'class' ) )
					.addClass( selectedItems.attr( 'class' ) );	

			// Ставим класс отметки
			li.removeClass( 'selected sel' )
				.not( '.optgroup' ).eq( element[0].selectedIndex ).addClass( 'selected sel' );

			// Отметка деактивации на пунктах
			li.removeClass( 'disabled' )
				.not( '.optgroup' )
				.filter( function( index ) { return optionList.eq( index ).is( ':disabled' ); } ).addClass( 'disabled' );

			// Добавляем класс, показывающий изменение селекта
			selectbox.toggleClass( 'changed', ( optionList.first( ).text( ) !== li.filter( '.selected' ).text( ) ) );

			// Активация/деактивация
			selectbox.toggleClass( 'disabled', element.is( ':disabled' ) );
			
			return this;
		},
		
		// Уничтожение
		destroy: function( )
		{
			this.element.off( '.' + pluginName )
						.removeAttr( 'style' )
						.parent( ).before( this.element ).remove( );
			
			return this;
		}
	};
	
	return Component;
} )( );