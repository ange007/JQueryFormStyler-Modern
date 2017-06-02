let Password = 
( function( )
{
	let Password = function( element, options, locale ) 
	{		
		//
		this.element = element;
		this.options = options;
		this.locale = locale;
				
		//
		const customButton = $( '<div class="jq-password__switch">' + ( this.options.switchHTML || '' ) + '</div>' );
		
		//
		this.password = $( '<div class="jq-password">' ).append( customButton ),
		this.button = ( customButton.children( 'button' ).length > 0 ? customButton.children( 'button' ) : customButton );

		// Есть ли текст в блоке, и нужно ли его ставить
		if( this.button.html( ) === '' && locale[ 'show' ] !== '' )
		{
			this.button.html( locale[ 'show' ] );

			// Если был вставлен только текст
			if( customButton.children( 'button' ).length <= 0 )
			{
				customButton.addClass( 'jq-password__switch-text' );
			}	
		}
		
		//
		this.element.after( this.password ).prependTo( this.password );
		
		//
		this.setEvents( )
			.repaint( );
	};
	
	Password.prototype = 
	{
		setEvents: function( )
		{
			const locale = this.locale,
				element = this.element,
				password = this.password,
				button = this.button;
			
			// Необходимо "перерисовать" контрол
			password.on( 'repaint', function( )
			{
				// Активация/деактивация
				password.toggleClass( 'disabled', element.is( ':disabled' ) );

				// Активация/деактивация кнопки
				button.prop( 'disabled', element.is( ':disabled' ) );
			} )	
			// Реакция на клик по кнопке
			.on( 'click', '.jq-password__switch', function( ) 
			{
				const switcher = $( this ),
					wrapper = switcher.closest( '.jq-password' ),
					seen = wrapper.is( '.jq-password_seen' );

				// Добавление/удаление класса
				wrapper.toggleClass( 'jq-password_seen', !seen );

				// Меняем текст
				if( locale[ 'show' ] !== '' && locale[ 'hide' ] !== '' )
				{
					button.html( seen ? locale[ 'show' ] : locale[ 'hide' ] );
				}

				//
				element.attr( 'type', ( seen ? 'password' : 'text' ) );
			} );

			// Фокусировка
			element.on( 'focus.' + pluginName, function( )
			{
				password.addClass( 'focused' );
			} )
			// Расфокусировка
			.on( 'blur.' + pluginName, function( )
			{
				password.removeClass( 'focused' );
			} );
			
			return this;
		},
		
		// Перерисовка
		repaint: function( )
		{
			const element = this.element,
				password = this.password,
				button = this.button;
			
			// Активация/деактивация
			password.toggleClass( 'disabled', element.is( ':disabled' ) );

			// Активация/деактивация кнопки
			button.prop( 'disabled', element.is( ':disabled' ) );
			
			return this;
		},
		
		// Уничтожение
		destroy: function( )
		{
			const element = this.element;
			
			element.off( '.' + pluginName + ', refresh' )
					.closest( '.jq-password' ).before( element ).remove( );
			
			return this;
		}
	}
	
	return Password;
} )( );