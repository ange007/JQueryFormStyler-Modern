( function( $ )
{
	$( function( )
	{
		// Проверка состояния
		var checkState = function( )
		{
			var section = $( this ).closest( 'div.section' ),
				stateBlock = section.children('[data-checkbox="' + this.id + '"]');
						
			if( $( this ).is( ':checkbox' ) )
			{
				var state = '';
				
				if( $( this ).is( ':disabled' ) )
				{
					state += 'disabled ';
				}
				
				if( $( this ).is( ':checked' ) )
				{
					state += 'checked';
				}
				else if( $( this ).is( ':indeterminate' ) )
				{
					state += 'indeterminate';
				}
				else
				{
					state += 'unchecked';
				}
				
				// Установка состояния
				stateBlock.html( state );
			}
		};
		
		// Стилизируем имеющиеся елементы
		$( 'input, select' ).styler( {
			selectSearch: true,
			onFormStyled: function( ) 
			{ 
				$( 'body' ).find( 'input, select' )
					.each( function( ) { checkState.call( this ); } );
			}
		} );
		
		// Обработка "изменения" елемента
		$( 'input, select' ).on( 'change', checkState );
				
		// Состояние "неопределено" по умолчанию
		$( '#checkbox-indeterminate' ).prop( 'indeterminate', 'true' )
									.trigger( 'refresh' );
		
		// input:checkbox с постоянными 3 состояниями
		$( '#checkbox-indeterminate-change' ).prop( 'indeterminate', 'true' )
											.styler( 'reinitialize', { checkboxIndeterminate: true } );
				
		//
		$( 'ul.menu' ).on( 'click', 'li:not(.current)', function( )
		{
			$( this ).addClass( 'current' )
					.siblings( ).removeClass( 'current' )
					.parents( 'div.wrapper' ).find( 'div.box' ).removeClass( 'visible' ).eq( $( this ).index( ) ).addClass( 'visible' );
			
			window.location.hash = $( this ).data( 'hash' );
			$( 'input' ).blur( );
		} );
		
		hash = window.location.hash.replace( /#(.+)/, '$1' );
		
		if( hash !== '' )
		{
			$( 'ul.menu li[data-hash=' + hash + ']' ).click( );
		}

		// Переключить активность
		$.fn.toggleDisabled = function( )
		{
			return this.each( function( )
			{
				this.disabled = !this.disabled;
			} );
		};

		// Переключить "отмеченность"
		$.fn.toggleChecked = function( )
		{
			return this.each( function( )
			{
				this.checked = !this.checked;
			} );
		};
		
		// 
		$( 'button' ).click( function( e )
		{
			e.preventDefault( );
		} );

		// Добавить input:checkbox
		$( 'button.add-checkbox' ).click( function( )
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
		$( 'button.add-radio' ).click( function( )
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

		//
		$( 'button.add-file' ).click( function( )
		{
			var file = $( '<input type="file" name="" />' );
			
			$( this ).closest( 'div.section' )
					.append( file );
			
			file.wrap( '<div></div>' ).styler( );
		} );

		//
		$( 'button.add-number' ).click( function( )
		{
			var number = $( '<input type="number" />' );
			
			$( this ).closest( 'div.section' )
					.append( number );
			
			number.before( '<br /><br />' ).styler( );
		} );

		//
		$( 'button.add-select' ).click( function( )
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
		$( 'button.add-options' ).click( function( )
		{
			var options = '';
			for( i = 1; i <= 5; i++ )
			{
				options += '<option>Опция ' + i + '</option>';
			}
			
			$( this ).closest( 'div.section' )
					.find( 'select' )
					.each( function( ) { $( this ).append( options ); } )
					.trigger( 'refresh' );
		} );

		//
		$( 'button.check' ).click( function( )
		{
			$( this ).closest( 'div.section' )
					.find( 'input' )
					.toggleChecked( )
					.trigger( 'refresh' );
		} );

		//
		$( 'button.disable-input' ).click( function( )
		{
			$( this ).closest( 'div.section' )
					.find( 'input' )
					.toggleDisabled( )
					.trigger( 'refresh' );
		} );

		//
		$( 'button.disable-select' ).click( function( )
		{
			$( this ).closest( 'div.section' )
					.find( 'select' )
					.toggleDisabled( )
					.trigger( 'refresh' );
		} );

		//
		$( 'button.disable-options' ).click( function( )
		{
			$( this ).closest( 'div.section' )
					.find( 'option' )
					.toggleDisabled( )
					.trigger( 'refresh' );
		} );
		
		// Проверка состояния
		$( 'button.check-state' ).click( function( )
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

	} );
} )( jQuery );