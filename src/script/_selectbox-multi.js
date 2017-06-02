let SelectBoxMulti = 
( function( )
{
	let SelectBoxMulti = function( element, options, locale ) 
	{
		//
		this.element = element;
		this.options = options;
		this.locale = locale;
			
		//
		const attr = new Attributes( this.element );
		
		//
		this.selectbox = $( '<div class="jq-select-multiple jqselect"></div>' )
							.attr( { 'id': attr.id, 'title': attr.title } )
							.addClass( attr.classes )
							.data( attr.data );

		// Вставляем оригинальный элемент в псевдоблок
		element.after( this.selectbox ).prependTo( this.selectbox );

		//
		this.loadList( );

		//
		const ul = $( 'ul', this.selectbox ),
			li = $( 'li', this.selectbox ).attr( 'unselectable', 'on' ),
			size = this.element.attr( 'size' ) || 4,
			ulHeight = ul.outerHeight( ) || 0,
			liHeight = li.outerHeight( ) || 0;

		//
		ul.css( { 'height': liHeight * size } );

		// 
		if( ulHeight > this.selectbox.height( ) )
		{
			ul.css( 'overflowY', 'scroll' );
			this.preventScrolling( ul );

			// Прокручиваем до выбранного пункта
			if( li.filter( '.selected' ).length )
			{
				ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected' ).position( ).top );
			}
		}

		// Прячем оригинальный селект
		this.element.addClass( 'jq-hidden' );
		
		//
		this.setEvents( )
			.repaint( );
	};
	
	SelectBoxMulti.prototype = 
	{
		// Загрузка списка
		loadList: function( )
		{
			const element = this.element,
				options = this.options,
				selectbox = this.selectbox;
			
			const optionList = $( 'option', element ),
				ulList = this.makeList( optionList );
				
			// Обновляем содержимое
			selectbox.html( ulList );
			
			//
			return this;
		},
		
		// Запрещаем прокрутку страницы при прокрутке селекта
		// @todo: Убрать дублирование
		preventScrolling: function( selector )
		{
			const scrollDiff = selector.prop( 'scrollHeight' ) - selector.outerHeight( );

			//
			let wheelDelta = null,
				scrollTop = null;

			// 
			selector.off( 'mousewheel DOMMouseScroll' )
					.on( 'mousewheel DOMMouseScroll', function( e )
			{
				wheelDelta = ( e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0 ) ? 1 : -1; // Направление прокрутки (-1 вниз, 1 вверх)
				scrollTop = selector.scrollTop( ); // Позиция скролла

				if( ( scrollTop >= scrollDiff && wheelDelta < 0 ) || ( scrollTop <= 0 && wheelDelta > 0 ) ) 
				{
					e.stopPropagation( );
					e.preventDefault( );
				}
			} );
		},

		// Формируем список селекта
		// @todo: Убрать дублирование
		makeList: function( opList )
		{
			let list = $( '<ul>' );

			// Перебираем список элементов
			for( let i = 0; i < opList.length; i++ )
			{					
				const op = opList.eq( i ),
					id = ( op.attr( 'id' ) || '' ) !== '' ? ( op.attr( 'id' ) + idSuffix ) : '',
					title = op.attr( 'title' );

				let liClass = op.attr( 'class' ) || '';

				if( op.is( ':selected' ) )
				{
					liClass += ( liClass !== '' ? ' ' : '' ) + 'selected sel';
				}

				if( op.is( ':disabled' ) )
				{
					liClass += ( liClass !== '' ? ' ' : '' ) + 'disabled';
				}

				// Параметры по умолчанию
				let defaultAttr = { 'title': title,
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
					let optGroupClass = '';

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
		},
		
		// Обработка событий
		setEvents: function( )
		{
			const context = this,
				element = this.element,
				options = this.options,
				selectbox = this.selectbox;	
		
			const optionList = $( 'option', element ),
				ul = $( 'ul', selectbox ),
				li = $( 'li', selectbox ),
				ulHeight = ul.outerHeight( ) || 0,
				liHeight = li.outerHeight( ) || 0,
				mobile = Android || iOS;
			
			// Необходимо "перерисовать" контрол
			selectbox.on( 'repaint', function( )
			{
				context.repaint( );
			} );

			// При клике на пункт списка
			// @todo: Для Андроида выделение реализовать по клику и повторному клику, без зажатия
			li.on( 'click tap', function( e )
			{
				const selected = $( this );

				// Клик должен срабатывать только при активном контроле
				if( element.is( ':disabled' ) || selected.is( '.disabled, .optgroup' ) )
				{
					return;
				}

				// Фокусируем
				element.focus( );
				
				//
				if( ( mobile && !element.is( '[multiple]' ) ) 
					|| ( !mobile && !e.ctrlKey && !e.metaKey && !e.shiftKey ) )
				{
					selected.siblings( ).removeClass( 'selected first' );
				}
				
				//
				if( ( mobile && !element.is( '[multiple]' ) ) 
					|| ( !mobile && !e.ctrlKey && !e.metaKey ) )
				{
					selected.addClass( 'selected' );
				}

				// Выделение нескольких пунктов
				if( element.is( '[multiple]' ) )
				{
					//
					if( !e.shiftKey )
					{
						selected.addClass( 'first' );
					}

					// Выделение пунктов при зажатом Ctrl
					if( mobile || e.ctrlKey || e.metaKey )
					{
						selected.toggleClass( 'selected first', !selected.is( '.selected' ) )
								.siblings( ).removeClass( 'first' );
					}
					// Выделение пунктов при зажатом Shift
					else if( e.shiftKey )
					{
						let prev = false,
							next = false;

						//
						selected.siblings( ).removeClass( 'selected' )
								.siblings( '.first' ).addClass( 'selected' );

						//
						selected.prevAll( ).each( function( ) {	prev = ( prev || $( this ).is( '.first' ) ); } );
						selected.nextAll( ).each( function( ) {	next = ( next || $( this ).is( '.first' ) ); } );

						// Предыдущие пункты
						if( prev )
						{
							selected.prevAll( ).each( function( )
							{
								if( $( this ).is( '.selected' ) ) {	return false; }
								else { $( this ).not( '.disabled, .optgroup' ).addClass( 'selected' );	}
							} );
						}

						// Следующие пункты
						if( next )
						{
							selected.nextAll( ).each( function( )
							{
								if( $( this ).is( '.selected' ) ) {	return false; }
								else { $( this ).not( '.disabled, .optgroup' ).addClass( 'selected' ); }
							} );
						}

						//
						if( li.filter( '.selected' ).length === 1 )
						{
							selected.addClass( 'first' );
						}
					}
				}

				// Отмечаем выбранные мышью
				optionList.prop( 'selected', false );

				//
				li.filter( '.selected' ).each( function( )
				{
					const item = $( this ),
						index = item.index( ) - ( item.is( '.option' ) ? item.prevAll( '.optgroup' ).length : 0 );

					optionList.eq( index ).prop( 'selected', true );
				} );

				//
				element.change( );
			} );

			// Отмечаем выбранные с клавиатуры
			optionList.each( function( i )
			{
				$( this ).data( 'optionIndex', i );
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
			.on( 'blur.' + pluginName, function( )
			{
				selectbox.removeClass( 'focused' );
			} );

			// Прокручиваем с клавиатуры
			if( ulHeight > selectbox.height( ) )
			{
				element.on( 'keydown.' + pluginName, function( e )
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

			return this;
		},
		
		// Перерисовка
		repaint: function( )
		{
			const element = this.element,
				options = this.options,
				selectbox = this.selectbox;	
		
			const optionList = $( 'option', element ),
				ul = $( 'ul', selectbox ),
				li = $( 'li', selectbox );			
			
			//
			let arrIndexes = [ ];
			optionList.filter( ':selected' )
						.each( function( ) { arrIndexes.push( $( this ).data( 'optionIndex' ) ); } );

			//
			li.removeClass( 'selected' )
				.not( '.optgroup' )
				.filter( function( i ) { return $.inArray( i, arrIndexes ) > -1; } )
				.addClass( 'selected' );

			// Отметка деактивации на пунктах
			li.removeClass( 'disabled' )
				.not( '.optgroup' )
				.filter( function( index ) { return optionList.eq( index ).is( ':disabled' ); } )
				.addClass( 'disabled' );

			// Активация/деактивация
			selectbox.toggleClass( 'disabled', element.is( ':disabled' ) );
		},
		
		// Уничтожение
		destroy: function( )
		{
			
		}
	};
	
	return SelectBoxMulti;
} )( );