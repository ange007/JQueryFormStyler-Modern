let Switcher = 
( function( )
{
	/**
	 * 
	 * @param {*} element 
	 * @param {*} options 
	 * @param {*} locale 
	 */
	let Component = function( element, options, locale ) 
	{
		//
		this.element = element;
		this.options = options;
		this.locale = locale;

		//
		const attr = new Attributes( this.element );

		//
		this.switcher = $( '<div class="jq-switcher">'
								+ '<div class="toggle-button"></div>'
								+ '<div class="toggle-text toggle-text-off">OFF</div>'
								+ '<div class="toggle-text toggle-text-on">ON</div>'
							+ '</div>' )
							.attr( { 'id': attr.id, 'title': attr.title, 'unselectable': 'on' } )
							.addClass( attr.classes )
							.data( attr.data );

		// Прячем оригинальный чекбокс
		this.element.attr( 'type', 'checkbox' )
					.addClass( 'jq-hidden' )
					.after( this.switcher ).prependTo( this.switcher );

		//
		this.setEvents( )
			.repaint( );
	};

	Component.prototype = 
	{
		/**
		 * Обработка событий
		 */
		setEvents: function( )
		{
			const context = this,
				options = this.options,
				element = this.element,
				switcher = this.switcher;

			// Необходимо "перерисовать" контрол 
			switcher.on( 'repaint', function( )
			{
				context.repaint( );
			} )	
			// Клик по псевдоблоку ( смена состояния )
			.on( 'click', function( e )
			{
				e.preventDefault( );

				// Обрабатываем только активный псевдобокс
				if( !switcher.is( '.disabled' ) )
				{
					//
					element.prop( 'checked', !element.is( ':checked' ) );

					// Фокусируем и изменяем вызываем состояние изменения
					element.focus( )
							.trigger( 'change' )
							.triggerHandler( 'click' );
				}
			} );

			// Клик по label привязанному к данному switcher
			element.closest( 'label' ).add( 'label[for="' + this.element.attr( 'id' ) + '"]' )
										.on( 'click.' + pluginName, function( e )
			{
				if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( switcher ).length )
				{
					switcher.triggerHandler( 'click' );
					e.preventDefault( );
				}
			} );

			// Обработка изменений
			element.on( 'change.' + pluginName, function( )
			{
				switcher.triggerHandler( 'repaint' );
			} )
			// Обработка переключения при помощи клавиатуры
			.on( 'keydown.' + pluginName, function( e )
			{
				if( e.which === 32 )
				{
					e.preventDefault( );
					switcher.triggerHandler( 'click' );
				}
			} )
			// Обработка наведения фокуса
			.on( 'focus.' + pluginName, function( )
			{
				if( switcher.is( '.disabled' ) )
				{
					return;
				}

				switcher.addClass( 'focused' );
			} )
			// Обработка снятия фокуса
			.on( 'blur.' + pluginName, function( )
			{
				switcher.removeClass( 'focused' );
			} );

			return this;
		},

		/**
		 * Перерисовка
		 */
		repaint: function( ) 
		{
			const element = this.element,
				switcher = this.switcher;

			//
			switcher.toggleClass( 'checked', element.is( ':checked' ) );

			// Активация/деактивация
			switcher.toggleClass( 'disabled', element.is( ':disabled' ) );

			return this;
		},

		/**
		 * Уничтожение
		 */
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