let SelectBoxMulti = 
( function( )
{
	let Component = function( element, options, locale ) 
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
			SelectBoxExtra.preventScrolling( ul );

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
	
	Component.prototype = 
	{
		// Загрузка списка
		loadList: function( )
		{
			const element = this.element,
				selectbox = this.selectbox;
			
			const optionList = $( 'option', element ),
				ulList = SelectBoxExtra.makeList( optionList );
				
			// Обновляем содержимое
			selectbox.html( ulList );
			
			//
			return this;
		},
		
		// Обработка событий
		setEvents: function( )
		{
			const context = this,
				element = this.element,
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
			li.on( 'click tap', function( e )
			{
				const selected = $( this );

				// Клик должен срабатывать только при активном контроле
				if( element.is( ':disabled' ) || selected.is( '.disabled' ) )
				{
					return;
				}
				
				// Фокусируем
				element.focus( );
				
				// Удаление лишних классов
				if( ( mobile && !element.is( '[multiple]' ) ) 
					|| ( !mobile && !e.ctrlKey && !e.metaKey && !e.shiftKey ) )
				{
					selected.siblings( ).removeClass( 'selected first' );
				}
				
				// Добавление класса отметки
				if( ( mobile && !element.is( '[multiple]' ) ) 
					|| ( !mobile && !e.ctrlKey && !e.metaKey ) )
				{
					selected.addClass( 'selected' );
				}

				// Если это заголовок группы
				if( element.is( '[multiple]' ) && selected.is( '.optgroup' ) )
				{
					// 
					let selectedGroup = selected.nextUntil( '.optgroup' );

					//
					selectedGroup.each( function( )
					{
						if( !$( this ).is( '.disabled, .optgroup' ) ) 
						{
							if( $( this ).is( '.first' ) ) 
							{
								$( this ).removeClass( 'first');
							}
							
							$( this ).toggleClass( 'selected' );
						}
					} );
				}
				// Выделение нескольких пунктов
				else if( element.is( '[multiple]' ) )
				{
					// Отмечаем классом - первый элемент
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
						// Функция отметки
						const selectedFunc = function( )
						{
							if( $( this ).is( '.selected' ) ) {	return false; }
							else { $( this ).not( '.disabled, .optgroup' ).addClass( 'selected' ); }
						};
						
						//
						selected.siblings( ).removeClass( 'selected' )
								.siblings( '.first' ).addClass( 'selected' );

						// Предыдущие пункты
						if( selected.prevAll( '.first' ).length > 0 )
						{
							selected.prevAll( ).each( selectedFunc );
						}

						// Следующие пункты
						if( selected.nextAll( '.first' ).length > 0 )
						{
							selected.nextAll( ).each( selectedFunc );
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
				selectbox = this.selectbox;	
		
			const optionList = $( 'option', element ),
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
			this.element.off( '.' + pluginName + ', refresh' )
						.removeAttr( 'style' )
						.parent( ).before( this.element ).remove( );
		}
	};
	
	return Component;
} )( );