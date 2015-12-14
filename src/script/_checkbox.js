var checkboxOutput = function( )
{
	var att = new Attributes( ),
		checkbox = $( '<div' + att.id + ' class="jq-checkbox' + att.classes + '"' + att.title + '><div class="jq-checkbox__div"></div></div>' );

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
	checkbox.attr( 'unselectable', 'on' ).css( {
		'-webkit-user-select': 'none',
		'-moz-user-select': 'none',
		'-ms-user-select': 'none',
		'-o-user-select': 'none',
		'user-select': 'none',
		display: 'inline-block',
		position: 'relative',
		overflow: 'hidden'
	} );

	// Установка изначального состояния псевдоблока
	if( el.is( ':indeterminate' ) )
	{
		checkbox.addClass( 'indeterminate' );
	}
	else if( el.is( ':checked' ) )
	{
		checkbox.addClass( 'checked' );
	}

	if( el.is( ':disabled' ) )
	{
		checkbox.addClass( 'disabled' );
	}

	// Клик по псевдоблоку
	checkbox.click( function( e )
	{
		e.preventDefault( );

		if( !checkbox.is( '.disabled' ) )
		{
			// Отмечено
			if( el.is( ':checked' ) || el.is( ':indeterminate' ) )
			{
				if( opt.checkboxIndeterminate === true && !el.prop( 'indeterminate' ) )
				{
					el.prop( 'checked', false );
					el.prop( 'indeterminate', true );
					checkbox.removeClass( 'checked' );
					checkbox.addClass( 'indeterminate' );
				}
				else
				{
					el.prop( 'checked', false );
					el.prop( 'indeterminate', false );
					checkbox.removeClass( 'indeterminate' );
					checkbox.removeClass( 'checked' );
				}
			}
			// Не отмечено
			else
			{
				el.prop( 'checked', true );
				el.prop( 'indeterminate', false );
				checkbox.removeClass( 'indeterminate' );
				checkbox.addClass( 'checked' );
			}

			el.focus().change();
		}
	} );

	// Клик по label привязанному к данному checkbox
	el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' ).on( 'click.styler', function( e )
	{
		if( !$( e.target ).is( 'a' ) && !$( e.target ).closest( checkbox ).length )
		{
			checkbox.triggerHandler( 'click' );
			e.preventDefault();
		}
	} );

	// Переключение по Space или Enter
	el.on( 'change.styler', function( )
	{
		if( el.is( ':checked' ) )
		{
			checkbox.addClass( 'checked' );
		}
		else
		{
			checkbox.removeClass( 'checked' );
		}
	} )
	// 
	.on( 'keydown.styler', function( e )
	{
		if( e.which === 32 )
		{
			checkbox.click( );
		}
	} )
	// Обработка наведения фокуса
	.on( 'focus.styler', function( )
	{
		if( !checkbox.is( '.disabled' ) )
		{
			checkbox.addClass( 'focused' );
		}
	} )
	// Обработка снятия фокуса
	.on( 'blur.styler', function( )
	{
		checkbox.removeClass( 'focused' );
	} );
};

// 
checkboxOutput( );

// Обновление при динамическом изменении
el.on( 'refresh', function()
{
	//
	el.closest( 'label' ).add( 'label[for="' + el.attr( 'id' ) + '"]' ).off( '.styler' );

	//
	el.off( '.styler' )
		.parent( ).before( el ).remove();

	checkboxOutput();
} );