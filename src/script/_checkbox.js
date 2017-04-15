var checkboxOutput = function( el )
{
	//
	var att = new Attributes( ),
		parent = el.parent( ),
		checkbox = $( '<div class="jq-checkbox"><div class="jq-checkbox__div"></div></div>' )
					.attr( { 'id': att.id, 'title': att.title, 'unselectable': 'on' } )
					.addClass( att.classes )
					.data( att.data );

	// Прячем оригинальный чекбокс
	el.addClass( 'jq-hidden' )
		.after( checkbox ).prependTo( checkbox );

	// Установка активности
	if( el.is( ':disabled' ) )
	{
		checkbox.addClass( 'disabled' );
	}
	
	// Клик по псевдоблоку ( смена состояния )
	checkbox.on( 'click', function( e )
	{
		e.preventDefault( );
		e.stopPropagation( );

		// Обрабатываем только активный псевдобокс
		if( !checkbox.is( '.disabled' ) )
		{
			// Текущее состояние: "Отмечено"
			if( el.is( ':checked' ) || el.is( ':indeterminate' ) )
			{
				// ... если работаем через 3 состояния - отмечаем "не определено",  или просто снимаем отметку
				el.prop( 'checked', ( opt.checkboxIndeterminate && el.is( ':indeterminate' ) ) );

				// "Неопределено" в любом случае снимаем
				el.prop( 'indeterminate', false );
			}
			// Текущее состояние: "Не отмечено"
			else
			{
				// ... если работаем через 3 состояния - отмечаем "не определено"
				if( opt.checkboxIndeterminate )
				{
					el.prop( 'checked', false )
						.prop( 'indeterminate', true );
				}
				// ... или просто отмечаем
				else
				{
					el.prop( 'checked', true )
						.prop( 'indeterminate', false );
				}
			}
			
			// Фокусируем и изменяем вызываем состояние изменения
			el.focus( )
				.trigger( 'change' )
				.trigger( 'click' );
		}
	} );

	// Клик по label привязанному к данному checkbox
	el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' )
						.on( 'click.' + pluginName, function( e )
	{
		if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( checkbox ).length )
		{
			checkbox.triggerHandler( 'click' );
			e.preventDefault( );
		}
	} );

	// Обработка изменений
	el.on( 'click.' + pluginName, function( e )
	{
		e.stopPropagation( );
		e.preventDefault( );
	} )
	.on( 'change.' + pluginName, function( e )
	{
		// Отмечено
		if( el.is( ':checked' ) || el.is( ':indeterminate' ) )
		{
			if( el.is( ':indeterminate' ) )
			{
				checkbox.removeClass( 'checked' )
						.addClass( 'indeterminate' );
			}
			else
			{
				checkbox.removeClass( 'indeterminate' )
						.addClass( 'checked' );
			}
		}
		// Не отмечено
		else
		{
			checkbox.removeClass( 'indeterminate' )
					.removeClass( 'checked' );
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
checkboxOutput( el );

// Обновление при динамическом изменении
el.on( 'refresh', function( )
{
	//
	el.closest( 'label' )
		.add( 'label[for="' + el.attr( 'id' ) + '"]' )
		.off( '.' + pluginName );

	// Убираем стилизацию компонента
	el.off( '.' + pluginName )
		.removeClass( 'jq-hidden' )
		.parent( ).before( el ).remove( );

	// Стилизируем компонент снова
	checkboxOutput( el );
} );