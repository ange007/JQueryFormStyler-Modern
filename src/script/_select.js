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

	var option = $( 'option', el ),
		list = '';
	
	// Формируем список селекта
	function makeList( )
	{
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
				optgroupClass = '',
				dataJqfsClass = '',
				disabled = 'disabled',
				selDis = 'selected sel disabled';
		
			if( op.prop( 'selected' ) )
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

			// если есть optgroup
			if( op.parent( ).is( 'optgroup' ) )
			{
				if( op.parent( ).attr( 'class' ) !== undefined )
				{
					optgroupClass = ' ' + op.parent( ).attr( 'class' );
				}
				
				li = '<li' + dataJqfsClass + dataList + ' class="' + liClass + optionClass + ' option' + optgroupClass + '"' + title + id + '>' + op.html( ) + '</li>';
				if( op.is( ':first-child' ) )
				{
					li = '<li class="optgroup' + optgroupClass + '">' + op.parent( ).attr( 'label' ) + '</li>' + li;
				}
			}

			list += li;
		}
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

		var selectbox = $( '<div' + att.id + ' class="' + classPrefix + 'selectbox jqselect' + att.classes + '" style="display: inline-block; position: relative; z-index:' + singleSelectzIndex + '">' +
							'<div class="' + classPrefix + 'selectbox__select"' + att.title + ' style="position: relative">' +
							'<div class="' + classPrefix + 'selectbox__select-text"></div>' +
							'<div class="' + classPrefix + 'selectbox__trigger"><div class="' + classPrefix + 'selectbox__trigger-arrow"></div></div>' +
							'</div>' +
							'</div>' );

		el.css( { margin: 0, padding: 0 } )
			.after( selectbox ).prependTo( selectbox );

		var divSelect = $( 'div.' + classPrefix + 'selectbox__select', selectbox ),
			divText = $( 'div.' + classPrefix + 'selectbox__select-text', selectbox ),
			optionSelected = option.filter( ':selected' );

		makeList( );

		if( selectSearch )
		{
			searchHTML = '<div class="' + classPrefix + 'selectbox__search"><input type="search" autocomplete="off" placeholder="' + selectSearchPlaceholder + '"></div>' +
							'<div class="' + classPrefix + 'selectbox__not-found">' + selectSearchNotFound + '</div>';
		}
		
		var dropdown = $( '<div class="' + classPrefix + 'selectbox__dropdown" style="position: absolute">' +
							searchHTML +
							'<ul style="position: relative; list-style: none; overflow: auto; overflow-x: hidden">' + list + '</ul>' +
							'</div>' );
		
		selectbox.append( dropdown );
		
		var ul = $( 'ul', dropdown ),
			li = $( 'li', dropdown ),
			search = $( 'input', dropdown ),
			notFound = $( 'div.' + classPrefix + 'selectbox__not-found', dropdown ).hide( );
	
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

		// подстраиваем ширину выпадающего списка в зависимости от самого широкого пункта
		if( liWidthInner > selectbox.width( ) )
		{
			dropdown.width( liWidthInner );
		}

		// прячем 1-ю пустую опцию, если она есть и если атрибут data-placeholder не пустой
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
	
		if( liSelected.length < 1 )
		{
			li.first( ).addClass( 'selected sel' );
		}
		
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
			if( $( 'div.' + classPrefix + 'selectbox' ).filter( '.opened' ).length )
			{
				opt.onSelectClosed.call( $( 'div.' + classPrefix + 'selectbox' ).filter( '.opened' ) );
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
						
			selectbox.css( { zIndex: singleSelectzIndex } );
			
			if( dropdown.is( ':hidden' ) )
			{
				$( 'div.' + classPrefix + 'selectbox__dropdown:visible' ).hide( );
				
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
				if( $( 'div.' + classPrefix + 'selectbox' ).filter( '.opened' ).length )
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
								.find( 'div.' + classPrefix + 'selectbox__dropdown' ).hide( );
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
			selectbox = $( '<div' + att.id + ' class="' + classPrefix + 'select-multiple jqselect' + att.classes + '"' + att.title + ' style="display: inline-block; position: relative"></div>' );

		// Формируем псевдоблок
		el.css( { margin: 0, padding: 0 } )
			.after( selectbox );

		// Формируем список
		makeList( );
		
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
			
			// прокручиваем до выбранного пункта
			if( li.filter( '.selected' ).length )
			{
				ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected' ).position( ).top );
			}
		}

		// прячем оригинальный селект
		el.prependTo( selectbox ).css( {
			position: 'absolute',
			left: 0,
			top: 0,
			width: '100%',
			height: '100%',
			opacity: 0
		} );

		// если селект неактивный
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

			// если селект активный
		}
		else
		{
			// при клике на пункт списка
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

				// выделение пунктов при зажатом Ctrl
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

				// выделение пунктов при зажатом Shift
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

				// отмечаем выбранные мышью
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

			// отмечаем выбранные с клавиатуры
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