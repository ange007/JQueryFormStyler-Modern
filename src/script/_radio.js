let Radio = 
( function( )
{
	let Radio = function( element, options, locale ) 
	{
		//
		this.element = element;
		this.options = options;
		this.locale = locale;
		
		//
		const attr = new Attributes( this.element );
		
		//
		this.radio = $( '<div class="jq-radio"><div class="jq-radio__div"></div></div>' )
						.attr( { 'id': attr.id, 'title': attr.title, 'unselectable': 'on' } )
						.addClass( attr.classes )
						.data( attr.data );

		// Прячем оригинальную радиокнопку
		this.element.addClass( 'jq-hidden' )
					.after( this.radio ).prependTo( this.radio );
			
		//
		this.setEvents( )
			.repaint( );
	};
	
	Radio.prototype = 
	{
		// Обработка событий
		setEvents: function( )
		{
			const context = this,
				element = this.element,
				radio = this.radio;
			
			// Необходимо "перерисовать" контрол 
			radio.on( 'repaint', function( )
			{
				context.repaint( );
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
					const name = element.attr( 'name' );

					// Ищем нужный нам елемент по родителям
					let findElement = radio.closest( '#' + name )
											.find( 'input[name="' + name + '"]:radio' );

					// ... или же по всему документу
					if( findElement.length <= 0 )
					{
						findElement = $( 'body' ).find( 'input[name="' + name + '"]:radio' );
					}

					// Снимаем отметку с найденного блока
					findElement.prop( 'checked', false )
							.parent( ).removeClass( 'checked' );			

					// Передаём фокус и вызываем событие - изменения
					element.prop( 'checked', true )
							.focus( )
							.trigger( 'change' )
							.triggerHandler( 'click' );
				}
			} );

			// Обработка изменений
			element.on( 'change.' + pluginName, function( e )
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
			element.closest( 'label' )
					.add( 'label[for="' + element.attr( 'id' ) + '"]' )
					.on( 'click.' + pluginName, function( e )
			{
				if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( radio ).length )
				{
					radio.triggerHandler( 'click' );
					e.preventDefault( );
				}
			} );
			
			return this;
		},
		
		// Перерисовка
		repaint: function( )
		{
			const element = this.element,
				radio = this.radio;
			
			// Отметка
			element.parent( ).toggleClass( 'checked', element.is( ':checked' ) );

			// Активация/деактивация
			radio.toggleClass( 'disabled', element.is( ':disabled' ) );
			
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
	}
	
	return Radio;
} )( );