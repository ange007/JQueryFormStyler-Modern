var numberOutput = function()
{
	// Инициализируем переменные
	var number = $( '<div class="jq-number"><div class="jq-number__spin minus"></div><div class="jq-number__spin plus"></div></div>' ),
		min,
		max,
		step,
		timeout = null,
		interval = null;
	
	// Добавляем нужные блоки
	el.after( number ).prependTo( number ).wrap( '<div class="jq-number__field"></div>' );

		//
	if( el.is( ':disabled' ) )
	{
		number.addClass( 'disabled' );
	}

	if( el.attr( 'min' ) !== undefined )
	{
		min = el.attr( 'min' );
	}
	
	if( el.attr( 'max' ) !== undefined )
	{
		max = el.attr( 'max' );
	}
	
	if( el.attr( 'step' ) !== undefined && $.isNumeric( el.attr( 'step' ) ) )
	{
		step = Number( el.attr( 'step' ) );
	}
	else
	{
		step = Number( 1 );
	}

	// 
	var changeValue = function( spin )
	{
		var value = el.val( ),
			newValue;
	
		if( !$.isNumeric( value ) )
		{
			value = 0;
			el.val( '0' );
		}
		
		if( spin.is( '.minus' ) )
		{
			newValue = parseInt( value, 10 ) - step;
			
			if( step > 0 )
			{
				newValue = Math.ceil( newValue / step ) * step;
			}
		} 
		else if( spin.is( '.plus' ) )
		{
			newValue = parseInt( value, 10 ) + step;
			
			if( step > 0 )
			{
				newValue = Math.floor( newValue / step ) * step;
			}
		}
		if( $.isNumeric( min ) && $.isNumeric( max ) )
		{
			if( newValue >= min && newValue <= max )
			{
				el.val( newValue );
			}
		} 
		else if( $.isNumeric( min ) && !$.isNumeric( max ) )
		{
			if( newValue >= min )
			{
				el.val( newValue );
			}
		}
		else if( !$.isNumeric( min ) && $.isNumeric( max ) )
		{
			if( newValue <= max )
			{
				el.val( newValue );
			}
		} 
		else
		{
			el.val( newValue );
		}
	};

	// 
	if( !number.is( '.disabled' ) )
	{
		number.on( 'mousedown', 'div.jq-number__spin', function( )
		{
			var spin = $( this );
			changeValue( spin );
			
			timeout = setTimeout( function( ) { interval = setInterval( function( ) { changeValue( spin ); }, 40 ); }, 350 );
		} )
		//
		.on( 'mouseup mouseout', 'div.jq-number__spin', function( )
		{
			clearTimeout( timeout );
			clearInterval( interval );
		} );
		
		//
		el.on( 'focus.styler', function()
		{
			number.addClass( 'focused' );
		} )
		.on( 'blur.styler', function()
		{
			number.removeClass( 'focused' );
		} );
	}

}; 

//
numberOutput( );

// Обновление при динамическом изменении
el.on( 'refresh', function()
{
	el.off( '.styler' )
		.closest( '.jq-number' ).before( el ).remove();

	//
	numberOutput();
} );