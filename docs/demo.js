( function( $ )
{
	$( function( )
	{
		var activeStyle = undefined;
		
		// Проверка состояния
		var checkState = function( )
		{
			var section = $( this ).closest( 'div.section' ),
				stateBlock = section.children( '[data-checkbox="' + this.id + '"]' ),
				state = '';
						
			if( !$( this ).is( ':checkbox' ) )
			{
				return;
			}

			if( $( this ).is( ':disabled' ) )
			{
				state += ' disabled ';
			}

			if( $( this ).is( ':checked' ) )
			{
				state += ' checked';
			}
			else if( $( this ).is( ':indeterminate' ) )
			{
				state += ' indeterminate';
			}
			else
			{
				state += ' unchecked';
			}

			// Установка состояния
			stateBlock.html( state );
		};
		
		// Переключить активность
		$.fn.toggleDisabled = function( repaint )
		{
			return this.each( function( )
			{
				$( this ).prop( 'disabled', !$( this ).is( ':disabled' ) );
				
				if( repaint !== false )	{ $( this ).trigger( 'repaint' ); }
			} );
		};

		// Переключить "отмеченность"
		$.fn.toggleChecked = function( repaint )
		{
			return this.each( function( )
			{
				$( this ).prop( 'checked', !$( this ).is( ':checked' ) );
			
				if( repaint !== false )	{ $( this ).trigger( 'repaint' ); }
			} );
		};
		
		// Стилизируем имеющиеся елементы
		$( 'input, select:not(#style)' ).styler( 
		{
			onFormStyled: function( ) 
			{ 
				$( 'body' ).find( 'input, select' )
							.each( function( ) { checkState.call( this, [ ] ); } );
			}
		} );
		
		// Смена стиля оформления
		$( '#style' ).on( 'change', function( )
		{
			if( activeStyle !== undefined )
			{
				activeStyle.remove( );
			}
			
			//
            activeStyle = $( "<link rel='stylesheet' href='../build/style/" + $( this ).val( ) + "' type='text/css' media='screen' />" ).appendTo( $( 'head' ) );
		} );
				
		// Обработка "изменения" елемента
		$( 'input, select' ).on( 'change', checkState );
				
		// Состояние "неопределено" по умолчанию
		$( '#checkbox-indeterminate' ).prop( 'indeterminate', 'true' )
										.trigger( 'repaint' );
		
		// input:checkbox с постоянными 3 состояниями
		$( '#checkbox-indeterminate-change' ).prop( 'indeterminate', 'true' )
											.styler( 'reinitialize', { checkbox: { indeterminate: true } } );
			
		// input:password без <button>
		$( '#p-2' ).styler( 'reinitialize', { password: { switchHTML: '' } } );		
		
		// input:password со своим текстом
		$( '#p-3' ).styler( 'reinitialize', { locales: { 
													password: { 
														show: 'Показать', 
														hide: 'Скрыть' 
													} 
											} } );	
											
		// input:password без кнопки
		$( '#p-4' ).styler( 'reinitialize', { password: { switchHTML: undefined } } );										
				
		//
		$( 'ul.menu' ).on( 'click', 'li:not(.current)', function( )
		{
			$( this ).addClass( 'current' )
					.siblings( ).removeClass( 'current' )
					.parents( 'div.wrapper' ).find( 'div.box' ).removeClass( 'visible' ).eq( $( this ).index( ) ).addClass( 'visible' );
			
			window.location.hash = $( this ).data( 'hash' );
			$( 'input' ).blur( );
		} );
				
		// Игнорируем действие по умолчанию для кнопок
		$( 'button' ).on( 'click', function( e )
		{
			e.preventDefault( );
		} );

		// Добавить input:checkbox
		$( 'button.add-checkbox' ).on( 'click', function( )
		{
			var inputs = '';
			for( var i = 1; i <= 5; i++ )
			{
				inputs += '<label><input type="checkbox" name="checkbox" /> чекбокс</label><br />';
			}
			$( this ).closest( 'div.section' )
					.append( '<div>' + inputs + '</div>' );
			
			$( 'input:checkbox' ).styler( );
		} );

		// Добавить input:radio
		$( 'button.add-radio' ).on( 'click', function( )
		{
			var inputs = '';
			for( var i = 1; i <= 5; i++ )
			{
				inputs += '<label><input type="radio" name="radio" /> радиокнопка</label><br />';
			}
			
			$( this ).closest( 'div.section' )
					.append( '<div>' + inputs + '</div>' );
			
			$( 'input:radio' ).styler( );
		} );

		// Добавить input:file
		$( 'button.add-file' ).on( 'click', function( )
		{
			var file = $( '<input type="file" name="" />' );
			
			$( this ).closest( 'div.section' )
					.append( file );
			
			file.wrap( '<div></div>' ).styler( );
		} );

		// Добавить input:number
		$( 'button.add-number' ).on( 'click', function( )
		{
			var number = $( '<input type="number" />' );
			
			$( this ).closest( 'div.section' )
					.append( number );
			
			number.before( '<br /><br />' ).styler( );
		} );
		
		// Добавить input:password
		$( 'button.add-password' ).on( 'click', function( )
		{
			var password = $( '<input type="password" />' );
			
			$( this ).closest( 'div.section' )
					.append( password );
			
			password.before( '<br /><br />' ).styler( );
		} );

		// Добавить select
		$( 'button.add-select' ).on( 'click', function( )
		{
			var multiple = '',
				select = $( '<select' + multiple + '><option>-- Выберите --</option><option>Пункт 1</option><option>Пункт 2</option><option>Пункт 3</option><option>Пункт 4</option><option>Пункт 5</option></select>' );
			
			if( $( this ).is( '.multiple' ) )
			{
				multiple = ' multiple';
			}
						
			$( this ).closest( 'div.section' )
					.append( select );
			
			select.before( '<br /><br />' ).styler( );
		} );

		//
		$( 'button.add-options' ).on( 'click', function( )
		{
			var options = '';
			for( i = 1; i <= 5; i++ )
			{
				options += '<option>Опция ' + i + '</option>';
			}
			
			$( this ).closest( 'div.section' )
					.find( 'select' )
					.each( function( ) { $( this ).append( options ); } );
		} );

		//
		$( 'button.check' ).on( 'click', function( )
		{
			$( this ).closest( 'div.section' )
					.find( 'input' )
					.toggleChecked( );
		} );

		//
		$( 'button.disable-input' ).on( 'click', function( )
		{
			$( this ).closest( 'div.section' )
					.find( 'input' )
					.toggleDisabled( );
		} );

		//
		$( 'button.disable-select' ).on( 'click', function( )
		{
			$( this ).closest( 'div.section' )
					.find( 'select' )
					.toggleDisabled( );
		} );

		//
		$( 'button.disable-options' ).on( 'click', function( )
		{
			$( this ).closest( 'div.section' )
					.find( 'option' )
					.toggleDisabled( false )
					.trigger( 'repaint' );
		} );
		
		// Проверка состояния
		$( 'button.check-state' ).on( 'click', function( )
		{
			var section = $( this ).closest( 'div.section' );
			
			section.find( 'input' )
					.each( function( )
					{ 
						var stateBlock = section.children('[data-checkbox="' + this.id + '"]');
						
						if( $( this ).is( ':checkbox' ) )
						{
							if( $( this ).is( '.disabled' ) )
							{
								stateBlock.html( 'disabled' );
							}
							else if( $( this ).is( ':checked' ) )
							{
								stateBlock.html( 'checked' );
							}
							else if( $( this ).is( ':indeterminate' ) )
							{
								stateBlock.html( 'indeterminate' );
							}
							else
							{
								stateBlock.html( 'unchecked' );
							}
						}
					} );
		} );


		//
		hash = window.location.hash.replace( /#(.+)/, '$1' );
		if( hash !== '' ) {	$( 'ul.menu>li[data-hash=' + hash + ']' ).trigger( 'click' ); }
		
		//
		$( '#style' ).trigger( 'change' );
	} );
} )( jQuery );