var numberOutput = function( )
{
	// Инициализируем переменные
	var number = $( '<div class="' + classPrefix + 'number"><div class="' + classPrefix + 'number__spin minus"></div><div class="' + classPrefix + 'number__spin plus"></div></div>' ),
		min,
		max,
		step,
		timeout = null,
		interval = null;
	
	// Добавляем нужные блоки
	el.after( number ).prependTo( number ).wrap( '<div class="' + classPrefix + 'number__field"></div>' );

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

	// Обработчики в случае "активности" компонента
	if( !number.is( '.disabled' ) )
	{
		// Обработка клика на компонент
		number.on( 'mousedown', 'div.' + classPrefix + 'number__spin', function( )
		{
			var spin = $( this );
			changeValue( spin );
			
			timeout = setTimeout( function( ) { interval = setInterval( function( ) { changeValue( spin ); }, 40 ); }, 350 );
		} )
		.on( 'mouseup mouseout', 'div.' + classPrefix + 'number__spin', function( )
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
		.closest( '.' + classPrefix + 'number' ).before( el ).remove( );

	// Стилизируем компонент снова
	numberOutput( );
} );