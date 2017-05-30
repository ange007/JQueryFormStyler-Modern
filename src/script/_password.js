var passwordOutput = function( el )
{
	// Параметры
	var params = this.options.password || { },
		locale = this.locales.password || { };
	
	// Если не нужно оставлять кнопку - не оставляем
	if( params.switchHTML === undefined || params.switchHTML === 'none' )
	{
		el.addClass( pluginName );
		
		return;
	}
	
	//
	var button = $( '<div class="jq-password__switch">' + ( params.switchHTML || '' ) + '</div>' ),
		password = $( '<div class="jq-password">' ).append( button ),
		customButton = ( button.children( 'button' ).length > 0 ? button.children( 'button' ) : button );
	
	// Есть ли текст в блоке, и нужно ли его ставить
	if( customButton.html( ) === '' && locale[ 'show' ] !== '' )
	{
		customButton.html( locale[ 'show' ] );
					
		// Если был вставлен только текст
		if( button.children( 'button' ).length <= 0 )
		{
			button.addClass( 'jq-password__switch-text' );
		}	
	}

	//
	el.after( password ).prependTo( password );

	// Необходимо "перерисовать" контрол
	password.on( 'repaint', function( )
	{
		// Активация/деактивация
		password.toggleClass( 'disabled', el.is( ':disabled' ) );
		
		// Активация/деактивация кнопки
		customButton.prop( 'disabled', el.is( ':disabled' ) );
	} )	
	// Реакция на клик по кнопке
	.on( 'click', '.jq-password__switch', function( ) 
	{
		var switcher = $( this ),
			wrapper = switcher.closest( '.jq-password' ),
			seen = wrapper.is( '.jq-password_seen' );

		// Добавление/удаление класса
		wrapper.toggleClass( 'jq-password_seen', !seen );

		// Меняем текст
		if( locale[ 'show' ] !== '' && locale[ 'hide' ] !== '' )
		{
			customButton.html( seen ? locale[ 'show' ] : locale[ 'hide' ] );
		}
		
		//
		el.attr( 'type', ( seen ? 'password' : 'text' ) );
	} );
	
	// Фокусировка
	el.on( 'focus.' + pluginName, function( )
	{
		password.addClass( 'focused' );
	} )
	// Расфокусировка
	.on( 'blur.' + pluginName, function( )
	{
		password.removeClass( 'focused' );
	} );
	
	// Мы установили стиль, уведомляем об изменении
	password.triggerHandler( 'repaint' );
}; 

// Стилизируем компонент
passwordOutput.call( this, element );