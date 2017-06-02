let Number = 
( function( )
{
	let Number = function( element, options, locale ) 
	{		
		//
		this.element = element;
		this.options = options;
		this.locale = locale;
				
		//
		const attr = new Attributes( this.element );
		
		//
		this.number = $( '<div class="jq-number">'
							+ '<div class="jq-number__spin minus"></div>'
							+ '<div class="jq-number__spin plus"></div>'
						+ '</div>' )
						.attr( { 'id': attr.id, 'title': attr.title } )
						.addClass( attr.classes )
						.data( attr.data );

		// Прячем оригинальную радиокнопку
		this.element.after( this.number ).prependTo( this.number )
					.wrap( '<div class="jq-number__field"></div>' );						
			
		//
		this.setEvents( )
			.repaint( );
	};
	
	Number.prototype = 
	{
		// Обработка событий
		setEvents: function( )
		{
			const context = this,
				element = this.element,
				number = this.number;
		
			let timeout = null,
				interval = null;
			
			// Необходимо "перерисовать" контрол
			number.on( 'repaint', function( )
			{
				context.repaint( );
			} )
			//
			.on( 'mousedown', 'div.jq-number__spin', function( )
			{
				if( element.is( ':disabled' ) )
				{
					return;
				}

				let spin = $( this );
				context.changeValue( spin );

				timeout = setTimeout( function( ) { interval = setInterval( function( ) { context.changeValue( spin ); }, 40 ); }, 350 );
			} )
			//
			.on( 'mouseup mouseout', 'div.jq-number__spin', function( )
			{
				if( element.is( ':disabled' ) )
				{
					return;
				}

				clearTimeout( timeout );
				clearInterval( interval );
			} );

			// Фокусировка
			element.on( 'focus.' + pluginName, function( )
			{
				number.addClass( 'focused' );
			} )
			// Расфокусировка
			.on( 'blur.' + pluginName, function( )
			{
				number.removeClass( 'focused' );
			} );
			
			return this;
		},
		
		// Перерисовка
		repaint: function( )
		{
			const element = this.element,
				number = this.number;
			
			number.toggleClass( 'disabled', element.is( ':disabled' ) );
			
			return this;
		},
		
		//
		changeValue: function( button )
		{
			const element = this.element,
				number = this.number;
			
			//
			const min = element.attr( 'min' ) || undefined,
				max = element.attr( 'max' ) || undefined,
				step = window.Number( element.attr( 'step' ) ) || 1;		
			
			//
			let value = $.isNumeric( element.val( ) ) ? element.val( ) : 0,
				newValue = window.Number( value ) + ( button.is( '.plus' ) ? step : -step );

			// Определяем количество десятичных знаков после запятой в step
			const decimals = ( step.toString( ).split( '.' )[1] || [ ] ).length.prototype;
			let	multiplier = '1';

			if( decimals > 0 )
			{
				while( multiplier.length <= decimals )
				{
					multiplier = multiplier + '0';
				}

				// Избегаем появления лишних знаков после запятой
				newValue = Math.round( newValue * multiplier ) / multiplier;
			}

			if( $.isNumeric( min ) && $.isNumeric( max ) )
			{
				if( newValue >= min && newValue <= max )
				{
					element.val( newValue )
							.change( );
				}
			} 
			else if( $.isNumeric( min ) && !$.isNumeric( max ) )
			{
				if( newValue >= min )
				{
					element.val( newValue )
							.change( );
				}
			}
			else if( !$.isNumeric( min ) && $.isNumeric( max ) )
			{
				if( newValue <= max )
				{
					element.val( newValue )
							.change( );
				}
			} 
			else
			{
				element.val( newValue )
						.change( );
			}
		},
		
		// Уничтожение
		destroy: function( )
		{
			const element = this.element;
			
			element.off( '.' + pluginName + ', refresh' )
					.closest( '.jq-number' ).before( element ).remove( );
			
			return this;
		}
	}
	
	return Number;
} )( );