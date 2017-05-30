var selectboxOutput = function( el )
{
	//
	var optionList = $( 'option', el );
	
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
										+ opt.selectTriggerHtml || ''
									+ '</div>'
							+ '</div></div>' )
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
			
			// Колбек при закрытии селекта
			if( $( 'div.jq-selectbox' ).filter( '.opened' ).length )
			{
				opt.onSelectClosed.call( $( 'div.jq-selectbox' ).filter( '.opened' ) );
			}

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

			// 
			$( 'div.jqselect' ).removeClass( 'opened' );

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
						.focus( )
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
						var find = $( this ).html( )
											.match( new RegExp( '.*?' + query + '.*?', 'i' ) );
							
						//
						$( this ).toggle( find ? true : false );
					} );
					
					// Прячем 1-ю пустую опцию
					if( optionList.first( ).text( ) === '' && el.data( 'placeholder' ) !== '' )
					{
						li.first( ).hide( );
					}
					
					// Видимость блока "не найдено"
					notFound.toggle( li.filter( ':visible' ).length < 1 );
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

	//= _selectbox-multi.js

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