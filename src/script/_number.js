var numberOutput = function( )
{
	// Инициализируем переменные
	var min,
		max,
		step,
		timeout = null,
		interval = null;

	// Формируем компонент
	var att = new Attributes( ),
		number =
			$( '<div class="jq-number">' +
				'<div class="jq-number__spin minus"></div>' +
				'<div class="jq-number__spin plus"></div>' +
				'</div>' )
			.attr( { 'id': att.id, 'title': att.title } )
			.addClass( att.classes )
			.data( att.data );

	
	// Добавляем нужные блоки
	el.after( number ).prependTo( number )
						.wrap( '<div class="jq-number__field"></div>' );

	// Обработка "неактивности"
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

	// Обработчики в случае "активности" компонента
	if( !number.is( '.disabled' ) )
	{
		// Обработка клика на компонент
		number.on( 'mousedown', 'div.jq-number__spin', function( )
		{
			var spin = $( this );
			changeValue( spin );
			
			timeout = setTimeout( function( ) { interval = setInterval( function( ) { changeValue( spin ); }, 40 ); }, 350 );
		} )
		.on( 'mouseup mouseout', 'div.jq-number__spin', function( )
		{
			clearTimeout( timeout );
			clearInterval( interval );
		} );
		
		// Фокусировка
		el.on( 'focus.' + pluginName, function( )
		{
			number.addClass( 'focused' );
		} )
		.on( 'blur.' + pluginName, function( )
		{
			number.removeClass( 'focused' );
		} );
	}
	
	// Мы установили стиль, уведомляем об изменении
	el.change( );
}; 

// Стилизируем компонент
numberOutput( );

// Обновление при динамическом изменении
el.on( 'refresh', function( )
{
	// Убираем стилизацию компонента
	el.off( '.' + pluginName )
		.closest( '.jq-number' ).before( el ).remove( );

	// Стилизируем компонент снова
	numberOutput( );
} );