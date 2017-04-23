var numberOutput = function( el )
{
	// Формируем компонент
	var att = new Attributes( el ),
		number = $( '<div class="jq-number">'
						+ '<div class="jq-number__spin minus"></div>'
						+ '<div class="jq-number__spin plus"></div>'
					+ '</div>' )
			.attr( { 'id': att.id, 'title': att.title } )
			.addClass( att.classes )
			.data( att.data );
	
	// Добавляем нужные блоки
	el.after( number ).prependTo( number )
						.wrap( '<div class="jq-number__field"></div>' );
	
	// Инициализируем переменные
	var min = el.attr( 'min' ) || undefined,
		max = el.attr( 'max' ) || undefined,
		step = Number( el.attr( 'step' ) ) || 1,
		timeout = null,
		interval = null;

	// Изменение значения
	var changeValue = function( spin )
	{
		var value = el.val( ),
			newValue;
	
		if( !$.isNumeric( value ) )
		{
			value = 0;
			
			el.val( '0' )
				.change( );
		}
		
		if( spin.is( '.minus' ) )
		{
			newValue = Number(value) - step;
		} 
		else if( spin.is( '.plus' ) )
		{
			newValue = Number(value) + step;
		}
		
		// Определяем количество десятичных знаков после запятой в step
		var decimals = ( step.toString().split( '.' )[1] || [ ] ).length.prototype,
			multiplier = '1';
			
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
				el.val( newValue )
					.change( );
			}
		} 
		else if( $.isNumeric( min ) && !$.isNumeric( max ) )
		{
			if( newValue >= min )
			{
				el.val( newValue )
					.change( );
			}
		}
		else if( !$.isNumeric( min ) && $.isNumeric( max ) )
		{
			if( newValue <= max )
			{
				el.val( newValue )
					.change( );
			}
		} 
		else
		{
			el.val( newValue )
				.change( );
		}
	};

	// Необходимо "перерисовать" контрол
	number.on( 'repaint', function( )
	{
		// Активация/деактивация
		number.toggleClass( 'disabled', el.is( ':disabled' ) );
	} )
	//
	.on( 'mousedown', 'div.jq-number__spin', function( )
	{
		if( el.is( ':disabled' ) )
		{
			return;
		}
		
		var spin = $( this );
		changeValue( spin );

		timeout = setTimeout( function( ) { interval = setInterval( function( ) { changeValue( spin ); }, 40 ); }, 350 );
	} )
	//
	.on( 'mouseup mouseout', 'div.jq-number__spin', function( )
	{
		if( el.is( ':disabled' ) )
		{
			return;
		}
		
		clearTimeout( timeout );
		clearInterval( interval );
	} );

	// Фокусировка
	el.on( 'focus.' + pluginName, function( )
	{
		number.addClass( 'focused' );
	} )
	// Расфокусировка
	.on( 'blur.' + pluginName, function( )
	{
		number.removeClass( 'focused' );
	} );
	
	// Мы установили стиль, уведомляем об изменении
	number.triggerHandler( 'repaint' );
}; 

// Стилизируем компонент
numberOutput( element );