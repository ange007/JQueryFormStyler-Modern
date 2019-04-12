let Radio = 
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
	
	Component.prototype = 
	{
		/**
		 * Обработка событий
		 */
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
				if( radio.is( '.disabled' ) )
				{
					return;
				}

				// Ищем общую группу элементов
				let findElements = context.commonParent( element );

				// Снимаем отметку с найденного блока
				findElements.prop( 'checked', false )
							.trigger( 'change' );

				// Передаём фокус и вызываем событие - изменения
				element.prop( 'checked', true )
						.focus( )
						.trigger( 'change' )
						.triggerHandler( 'click' );
			} );

			// Обработка изменений
			element.on( 'change.' + pluginName, function( )
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
				if( radio.is( '.disabled' ) )
				{
					return;
				}

				radio.addClass( 'focused' );
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

		/**
		 * 
		 */
		commonParent: function( element )
		{
			// Имя "якорь"
			const name = element.attr( 'name' ),
				selector = 'input[name="' + name + '"]:radio';

			// Ищем нужный нам в родительской форме
			let findElements = element.closest( '.jq-radio' ).closest( 'form' ).find( selector );
	
			// ... или же по всему документу
			if( findElements.length <= 0 ) { findElements = $( 'body' ).find( selector ); }

			return findElements;
		},
		
		/**
		 * Перерисовка
		 */
		repaint: function( )
		{
			const element = this.element,
				radio = this.radio;
			
			// Отметка оригинального элемента
			element.parent( ).toggleClass( 'checked', element.is( ':checked' ) );

			// Активация/деактивация
			radio.toggleClass( 'disabled', element.is( ':disabled' ) );
			
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