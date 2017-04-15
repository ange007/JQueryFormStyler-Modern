var radioOutput = function( el )
{
	var att = new Attributes( ),
		radio = $( '<div class="jq-radio"><div class="jq-radio__div"></div></div>' )
				.attr( { 'id': att.id, 'title': att.title, 'unselectable': 'on' } )
				.addClass( att.classes )
				.data( att.data );

	// Прячем оригинальную радиокнопку
	el.addClass( 'jq-hidden' )
		.after( radio ).prependTo( radio );

	// Установка изначального состояния псевдоблока
	if( el.is( ':disabled' ) )
	{
		radio.addClass( 'disabled' );
	} 
	
	// Клик по псевдоблоку
	radio.on( 'click', function( e )
	{
		//
		e.preventDefault( );

		// Обрабатываем только активную радиокнопку
		if( !radio.is( '.disabled' ) )
		{
			//
			var name = el.attr( 'name' );
			
			// Ищем нужный нам елемент в блоке который указан в настройках ( по умолчанию form )
			var findElement = radio.closest( opt.wrapper )
								.find( 'input[name="' + name + '"]:radio' );

			// ... если не нашли - ищем по родителям
			if( findElement.length <= 0 )
			{
				findElement = radio.closest( '#' + name )
								.find( 'input[name="' + name + '"]:radio' );
			}

			// ... или же по всему документу
			if( findElement.length <= 0 )
			{
				findElement = $( 'body' ).find( 'input[name="' + name + '"]:radio' );
			}

			// Снимаем отметку с найденного блока
			findElement.prop( 'checked', false )
					.parent( ).removeClass( 'checked' );			

			// Передаём фокус и вызываем событие - изменения
			el.prop( 'checked', true )
				.focus( )
				.trigger( 'change' )
				.trigger( 'click' );
		}
	} );
		
	// Переключение стрелками
	el.on( 'click.' + pluginName, function( e )
	{
		e.stopPropagation( );
		e.preventDefault( );
	} )
	.on( 'change.' + pluginName, function( e )
	{
		if( !el.is( ':disabled' ) )
		{
			if( $( this ).is(':checked') )
			{
				el.parent( )
					.addClass( 'checked' );
			}
			else
			{
				el.parent( )
					.removeClass( 'checked' );
			}
		}
		
	} )
	// Обработка наведения фокуса
	.on( 'focus.' + pluginName, function( )
	{
		if( !radio.is( '.disabled' ) )
		{
			radio.addClass( 'focused' );
		}
	} )
	// Обработка снятия фокуса
	.on( 'blur.' + pluginName, function( )
	{
		radio.removeClass( 'focused' );
	} );
	
	// Клик на label
	el.closest( 'label' )
		.add( 'label[for="' + el.attr( 'id' ) + '"]' )
		.on( 'click.' + pluginName, function( e )
	{
		if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( radio ).length )
		{
			radio.triggerHandler( 'click' );
			e.preventDefault( );
		}
	} );
	
	// Мы установили стиль, уведомляем об изменении
	el.change( );
};

// Стилизируем компонент
radioOutput( el );

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
	radioOutput( el );
} );
