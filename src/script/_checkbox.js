var checkboxOutput = function( )
{
	var att = new Attributes( ),
		checkbox = $( '<div' + att.id + ' class="' + classPrefix + 'checkbox' + att.classes + '"' + att.title + '><div class="' + classPrefix + 'checkbox__div"></div></div>' );

	// Прячем оригинальный чекбокс
	el.css( {
		position: 'absolute',
		zIndex: '-1',
		opacity: 0,
		margin: 0,
		padding: 0
	} )
	.after( checkbox ).prependTo( checkbox );

	// 
	checkbox.attr( 'unselectable', 'on' )
		.css( {
			'-webkit-user-select': 'none',
			'-moz-user-select': 'none',
			'-ms-user-select': 'none',
			'-o-user-select': 'none',
			'user-select': 'none',
			display: 'inline-block',
			position: 'relative',
			overflow: 'hidden'
	} );

	// Установка активности
	if( el.is( ':disabled' ) )
	{
		checkbox.addClass( 'disabled' );
	}
	
	// Клик по псевдоблоку ( смена состояния )
	checkbox.click( function( e )
	{
		e.preventDefault( );

		// Обрабатываем только активный псевдобокс
		if( !checkbox.is( '.disabled' ) )
		{
			// Текущее состояние: "Отмечено"
			if( el.is( ':checked' ) || el.is( ':indeterminate' ) )
			{
				// ... если работаем через 3 состояния - отмечаем "не определено",  или просто снимаем отметку
				el.prop( 'checked', ( opt.checkboxIndeterminate === true && el.is( ':indeterminate' ) ) );

				// "Неопределено" в любом случае снимаем
				el.prop( 'indeterminate', false );
			}
			// Текущее состояние: "Не отмечено"
			else
			{
				// ... если работаем через 3 состояния - отмечаем "не определено"
				if( opt.checkboxIndeterminate === true )
				{
					el.prop( 'checked', false );
					el.prop( 'indeterminate', true );
				}
				// ... или просто отмечаем
				else
				{
					el.prop( 'checked', true );
					el.prop( 'indeterminate', false );
				}
			}
			
			// Фокусируем и изменяем вызываем состояние изменения
			el.focus( )
				.change( );
		}
	} );

	// Клик по label привязанному к данному checkbox
	el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' ).on( 'click.' + pluginName, function( e )
	{
		if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( checkbox ).length )
		{
			checkbox.triggerHandler( 'click' );
			e.preventDefault( );
		}
	} );

	// Обработка изменений
	el.on( 'change.' + pluginName, function( )
	{
		// Отмечено
		if( el.is( ':checked' ) || el.is( ':indeterminate' ) )
		{
			if( el.is( ':indeterminate' ) )
			{
				checkbox.removeClass( 'checked' );
				checkbox.addClass( 'indeterminate' );
			}
			else
			{
				checkbox.removeClass( 'indeterminate' );
				checkbox.addClass( 'checked' );
			}
		}
		// Не отмечено
		else
		{
			checkbox.removeClass( 'indeterminate' );
			checkbox.removeClass( 'checked' );
		}
	} )
	// Обработка переключения при помощи клавиатуры
	.on( 'keydown.' + pluginName, function( e )
	{
		if( e.which === 32 )
		{
			e.preventDefault( );
			checkbox.click( );
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
	
	// Мы установили стиль, уведомляем об изменении
	el.change( );
};

// Стилизируем компонент
checkboxOutput( );

// Обновление при динамическом изменении
el.on( 'refresh', function( )
{
	//
	el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' )
						.off( '.' + pluginName );

	// Убираем стилизацию компонента
	el.off( '.' + pluginName )
		.parent( ).before( el ).remove( );

	// Стилизируем компонент снова
	checkboxOutput( );
} );