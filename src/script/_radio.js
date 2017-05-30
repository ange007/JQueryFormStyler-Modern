var radioOutput = function( el )
{
	// Параметры
	var params = this.options.radio || { },
		locale = this.locales.radio || { };
	
	// Формируем компонент
	var att = new Attributes( el ),
		radio = $( '<div class="jq-radio"><div class="jq-radio__div"></div></div>' )
				.attr( { 'id': att.id, 'title': att.title, 'unselectable': 'on' } )
				.addClass( att.classes )
				.data( att.data );

	// Прячем оригинальную радиокнопку
	el.addClass( 'jq-hidden' )
		.after( radio ).prependTo( radio );
	
	// Необходимо "перерисовать" контрол 
	radio.on( 'repaint', function( )
	{
		// Отметка
		el.parent( ).toggleClass( 'checked', el.is( ':checked' ) );

		// Активация/деактивация
		radio.toggleClass( 'disabled', el.is( ':disabled' ) );
	} )
	// Клик по псевдоблоку
	.on( 'click', function( e )
	{
		//
		e.preventDefault( );

		// Обрабатываем только активную радиокнопку
		if( !radio.is( '.disabled' ) )
		{
			//
			var name = el.attr( 'name' );
			
			// Ищем нужный нам елемент по родителям
			var findElement = radio.closest( '#' + name )
									.find( 'input[name="' + name + '"]:radio' );

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
				.triggerHandler( 'click' );
		}
	} );

	// Обработка изменений
	el.on( 'change.' + pluginName, function( e )
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
	radio.triggerHandler( 'repaint' );
};

// Стилизируем компонент
radioOutput.call( this, element );