let SelectBox = 
( function( )
{
	let Element = function( element, options, locale ) 
	{
		//
		this.element = element;
		this.options = options;
		this.locale = locale;
			
		//
		const attr = new Attributes( this.element );
		
		// Выпадающий список
		this.dropdown = $( '<div class="jq-selectbox__dropdown" style="position: absolute">'
							+ '</div>' );
				
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
		
		// 
		// const selectedText = li.filter( '.selected' ).text( );

		//
		this.setEvents( )
			.repaint( );

		// Прячем оригинальный селект
		element.addClass( 'jq-hidden' );
	
		// Прячем выпадающий список при клике за пределами селекта
		if( !onDocumentClick.registered )
		{
			$( document ).on( 'click', onDocumentClick );
			onDocumentClick.registered = true;
		}
	};
	
	Element.prototype = 
	{
		//
		loadDropdown: function( )
		{
			const element = this.element,
				options = this.options,
				locale = this.locale,
				selectbox = this.selectbox,
				dropdown = this.dropdown;
			
			//
			const optionList = $( 'option', element ),
				optionSelected = optionList.filter( ':selected' ),
				ulList = SelectBoxExtra.makeList( optionList ),
				searchEnabled = ( !element.data( 'search' ) || ( options.search ? true : false ) );
		
			// Очищаем содержимое
			dropdown.html( '' )
					.append( ulList );
			
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
			if( searchEnabled && dropdownLi.length > options.search.limit )
			{
				let searchBlock = $( '<div class="jq-selectbox__search">'
										+ '<input type="search" autocomplete="off" placeholder="' + ( element.data( 'search-placeholder' ) || locale.search[ 'placeholder' ] ) + '">'
									+ '</div>'
									+ '<div class="jq-selectbox__not-found">' + ( element.data( 'search-not-found' ) || locale.search[ 'notFound' ] ) + '</div>' );
							
				dropdown.prepend( searchBlock );
			}
							
			// Скрываем список
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
				selectbox.data( 'jqfs-class', liSelected.data( 'jqfs-class' ) )
						.addClass( liSelected.data( 'jqfs-class' ) );
			}
			
			return this;
		},
		
		// Расчёт ширины
		calculateDropdownWidth: function( )
		{
			const element = this.element,
				options = this.options,
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
		},
			
		// Обработка событий
		setEvents: function( )
		{
			const context = this,
				element = this.element,
				options = this.options,
				locale = this.locale,
				selectbox = this.selectbox,
				dropdown = this.dropdown,
				selectboxSelect = this.selectboxSelect,
				selectboxText = this.selectboxText;
			
			//
			const optionList = $( 'option', this.element ),
				selectSearch = element.data( 'search' ) || ( options.search ? true : false ),
				selectSearchLimit = element.data( 'search-limit' ) || ( options.search || {} ).limit,
				selectSmartPosition = element.data( 'smart-position' ) || options.smartPosition,
				selectSearchNotFound = element.data( 'search-not-found' ) || locale.search[ 'notFound' ],
				selectSearchPlaceholder = element.data( 'search-placeholder' ) || locale.search[ 'placeholder' ];
			
			// Разбираем на составляющие выпадающий список
			const dropdownUl = $( 'ul', dropdown ),
				dropdownLi = $( 'li', dropdown ),
				dropdownSearch = $( 'input', dropdown ),
				notFound = $( 'div.jq-selectbox__not-found', dropdown ),
				selectHeight = selectbox.outerHeight( true ) || 0,
				maxHeight = dropdownUl.css( 'max-height' ) || 0,
				position = selectHeight || 0;
			
			// Необходимо "перерисовать" контрол
			selectbox.on( 'repaint', function( )
			{
				context.repaint( );
			} );
			
			// Клик по псевдоблоку
			selectboxSelect.on( 'click', function( )
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
				element.focus( );

				// Если iOS, то не показываем выпадающий список,
				// т.к. отображается нативный и неизвестно, как его спрятать
				if( iOS )
				{
					return;
				}

				// Умное позиционирование - переменные
				let liHeight = dropdownLi.data( 'li-height' ) || 0;

				// Умное позиционирование - константы
				const visible = element.data( 'visible-options' ) || options.visibleOptions,
					topOffset = selectbox.offset( ).top || 0,
					bottomOffset = $( window ).height( ) - selectHeight - ( topOffset - $( window ).scrollTop( ) ),
					searchHeight = dropdownSearch.parent( ).outerHeight( true ) || 0,
					newHeight = ( visible === 0 ) ? 'auto' : liHeight * visible,
					minHeight = ( visible > 0 && visible < 6 ) ? newHeight : liHeight * 5;

				//
				if( dropdown.is( ':hidden' ) )
				{
					// 
					$( 'div.jqselect' ).removeClass( 'opened' );
					
					//
					$( 'div.jq-selectbox__dropdown:visible' ).hide( );
					
					// Отображаем список
					dropdown.show( );

					// Добавляем классы
					selectbox.addClass( 'opened focused' );		
					
					// Раскрытие вверх
					if( options.smartPosition && ( bottomOffset <= ( minHeight + searchHeight + liHeight ) ) )
					{
						context.dropUp( dropdownUl, topOffset, newHeight, liHeight, maxHeight );
					}
					// Раскрытие вниз
					else 
					{
						context.dropDown( dropdownUl, bottomOffset, newHeight, liHeight, maxHeight );
					}

					// Если выпадающий список выходит за правый край окна браузера,
					// то меняем позиционирование с левого на правое
					if( selectbox.offset( ).left + dropdown.outerWidth( ) > $( window ).width( ) )
					{
						dropdown.css( { left: 'auto', right: 0 } );
					}

					// Колбек при открытии селекта
					options.onOpened.call( selectbox );
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
						options.onClosed.call( selectbox );
					}
				}

				// Поисковое поле
				if( dropdownSearch.length )
				{
					// Сбрасываем значение и начинаем поиск
					dropdownSearch.val( '' )
								.focus( )
								.trigger( 'keyup' );

					// Прячем блок "не найдено"
					notFound.hide( );
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
			} );
			
			// Начинаем поиск после "отжатия кнопки"
			dropdownSearch.on( 'keyup', function( )
			{
				const query = $( this ).val( );

				// Проходим по содержимому
				dropdownLi.each( function( )
				{
					const find = $( this ).html( )
										.match( new RegExp( '.*?' + query + '.*?', 'i' ) );

					//
					$( this ).toggle( find ? true : false );
				} );

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
				$( 'li.sel', dropdown ).addClass( 'selected' );
			} );

			// При наведении курсора на пункт списка
			dropdownLi.on( 'hover', function( )
			{
				$( this ).siblings( ).removeClass( 'selected' );
			} )	
			// При клике на пункт визуального списка
			.on( 'click', function( )
			{
				const selected = $( this );

				// Если пункт не активен или заголовок - не пускаем дальше
				if( selected.is( '.disabled, .optgroup' ) )
				{
					return;
				}

				// Фокусируем
				element.focus( );

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
				dropdown.hide( );
				selectbox.removeClass( 'opened dropup dropdown' );

				// Колбек при закрытии селекта
				options.onClosed.call( selectbox );

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
				let liHeight = dropdownLi.data( 'li-height' );

				// Вверх, влево, Page Up, Home
				if( e.which === 38 || e.which === 37 || e.which === 33 || e.which === 36 )
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
				if( e.which === 40 || e.which === 39 || e.which === 34 || e.which === 35 )
				{
					dropdownUl.scrollTop( dropdownUl.scrollTop( ) + dropdownLi.filter( '.selected' ).position( ).top - dropdownUl.innerHeight( ) + liHeight );
				}

				// Закрываем выпадающий список при нажатии Enter
				if( e.which === 13 )
				{
					e.preventDefault( );
					dropdown.hide( );
					selectbox.removeClass( 'opened dropup dropdown' );

					// Колбек при закрытии селекта
					options.onClosed.call( selectbox );
				}
			} )
			//
			.on( 'keydown.' + pluginName, function( e )
			{
				// Открываем выпадающий список при нажатии Space
				if( e.which === 32 )
				{
					e.preventDefault( );
					selectboxSelect.trigger( 'click' );
				}
			} );
			
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
			if( selectedItems.val( ) === '' )
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
			this.element.off( '.' + pluginName + ', refresh' )
						.removeAttr( 'style' )
						.parent( ).before( this.element ).remove( );
			
			return this;
		}
	};
	
	return Element;
} )( );