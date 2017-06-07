let CheckBox = 
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
		this.checkbox = $( '<div class="jq-checkbox"><div class="jq-checkbox__div"></div></div>' )
							.attr( { 'id': attr.id, 'title': attr.title, 'unselectable': 'on' } )
							.addClass( attr.classes )
							.data( attr.data );
			
		// Прячем оригинальный чекбокс
		this.element.addClass( 'jq-hidden' )
					.after( this.checkbox ).prependTo( this.checkbox );
			
		//
		this.setEvents( )
			.repaint( );
	};
	
	Component.prototype = 
	{
		// Обработка событий
		setEvents: function( )
		{
			const context = this,
				options = this.options,
				element = this.element,
				checkbox = this.checkbox;

			// Необходимо "перерисовать" контрол 
			checkbox.on( 'repaint', function( )
			{
				context.repaint( );
			} )	
			// Клик по псевдоблоку ( смена состояния )
			.on( 'click', function( e )
			{
				e.preventDefault( );

				// Обрабатываем только активный псевдобокс
				if( !checkbox.is( '.disabled' ) )
				{
					// Текущее состояние: "Отмечено"
					if( element.is( ':checked' ) || element.is( ':indeterminate' ) )
					{
						// ... если работаем через 3 состояния - отмечаем "не определено",  или просто снимаем отметку
						element.prop( 'checked', ( options.indeterminate && element.is( ':indeterminate' ) ) );

						// "Неопределено" в любом случае снимаем
						element.prop( 'indeterminate', false );
					}
					// Текущее состояние: "Не отмечено"
					else
					{
						// ... если работаем через 3 состояния - отмечаем "не определено"
						if( options.indeterminate )
						{
							element.prop( 'checked', false )
									.prop( 'indeterminate', true );
						}
						// ... или просто отмечаем
						else
						{
							element.prop( 'checked', true )
									.prop( 'indeterminate', false );
						}
					}

					// Фокусируем и изменяем вызываем состояние изменения
					element.focus( )
							.trigger( 'change' )
							.triggerHandler( 'click' );
				}
			} );

			// Клик по label привязанному к данному checkbox
			element.closest( 'label' ).add( 'label[for="' + this.element.attr( 'id' ) + '"]' )
								.on( 'click.' + pluginName, function( e )
			{
				if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( checkbox ).length )
				{
					checkbox.triggerHandler( 'click' );
					e.preventDefault( );
				}
			} );

			// Обработка изменений
			element.on( 'change.' + pluginName, function( )
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

			return this;
		},

		// Перерисовка
		repaint: function( ) 
		{
			const element = this.element,
				checkbox = this.checkbox;

			// Отмечено
			if( element.is( ':checked' ) || element.is( ':indeterminate' ) )
			{
				if( element.is( ':indeterminate' ) )
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
			checkbox.toggleClass( 'disabled', element.is( ':disabled' ) );

			return this;
		},

		// Уничтожение
		destroy: function( )
		{
			const element = this.element;
			
			//
			element.off( '.' + pluginName + ', refresh' )
					.removeAttr( 'style' )
					.parent( ).before( element ).remove( );

			//
			element.closest( 'label' )
					.add( 'label[for="' + element.attr( 'id' ) + '"]' )
					.off( '.' + pluginName );

			return this;
		}
	};
	
	return Component;
} )( );