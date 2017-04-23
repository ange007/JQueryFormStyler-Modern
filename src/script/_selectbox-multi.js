// Мультиселект
function doMultipleSelect( el )
{
	var att = new Attributes( el ),
		ulList = makeList( optionList ),
		selectbox = $( '<div class="jq-select-multiple jqselect"></div>' )
					.attr( { 'id': att.id, 'title': att.title } )
					.addClass( att.classes )
					.data( att.data )
					.append( ulList );

	// Формируем псевдоблок
	el.after( selectbox ).prependTo( selectbox );

	//
	var ul = $( 'ul', selectbox ),
		li = $( 'li', selectbox ).attr( 'unselectable', 'on' ),
		size = el.attr( 'size' ) || 4,
		ulHeight = ul.outerHeight( ) || 0,
		liHeight = li.outerHeight( ) || 0;

	//
	ul.css( { 'height': liHeight * size } );

	// 
	if( ulHeight > selectbox.height( ) )
	{
		ul.css( 'overflowY', 'scroll' );
		preventScrolling( ul );

		// Прокручиваем до выбранного пункта
		if( li.filter( '.selected' ).length )
		{
			ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected' ).position( ).top );
		}
	}

	// Прячем оригинальный селект
	el.addClass( 'jq-hidden' );
	
	// Необходимо "перерисовать" контрол
	selectbox.on( 'repaint', function( )
	{
		var arrIndexes = [ ];
		optionList.filter( ':selected' )
					.each( function( ) { arrIndexes.push( $( this ).data( 'optionIndex' ) ); } );
		
		//
		li.removeClass( 'selected' )
			.not( '.optgroup' )
			// .filter( function( index ) { return optionList.eq( index ).is( ':selected' ); } )
			.filter( function( i ) { return $.inArray( i, arrIndexes ) > -1; } )
			.addClass( 'selected' );
	
		// Отметка деактивации на пунктах
		li.removeClass( 'disabled' )
			.not( '.optgroup' )
			.filter( function( index ) { return optionList.eq( index ).is( ':disabled' ); } )
			.addClass( 'disabled' );

		// Активация/деактивация
		selectbox.toggleClass( 'disabled', el.is( ':disabled' ) );
	} );

	// При клике на пункт списка
	li.click( function( e )
	{
		var selected = $( this );
		
		// Клик должен срабатывать только при активном контроле
		if( el.is( ':disabled' ) || selected.is( '.disabled, .optgroup' ) )
		{
			return;
		}
		
		// Фокусируем
		el.focus( );

		//
		if( !e.ctrlKey && !e.metaKey )
		{
			selected.addClass( 'selected' );
		}

		//
		if( !e.shiftKey )
		{
			selected.addClass( 'first' );
		}

		//
		if( !e.ctrlKey && !e.metaKey && !e.shiftKey )
		{
			selected.siblings( ).removeClass( 'selected first' );
		}

		// Выделение пунктов при зажатом Ctrl
		if( e.ctrlKey || e.metaKey )
		{
			selected.toggleClass( 'selected first', !selected.is( '.selected' ) );
			selected.siblings( ).removeClass( 'first' );
		}

		// Выделение пунктов при зажатом Shift
		if( e.shiftKey )
		{
			var prev = false,
				next = false;

			//
			selected.siblings( ).removeClass( 'selected' )
					.siblings( '.first' ).addClass( 'selected' );

			//
			selected.prevAll( ).each( function( ) {	prev = ( prev || $( this ).is( '.first' ) ); } );
			selected.nextAll( ).each( function( ) {	next = ( next || $( this ).is( '.first' ) ); } );

			//
			if( prev )
			{
				selected.prevAll( ).each( function( )
				{
					if( $( this ).is( '.selected' ) ) {	return false; }
					else { $( this ).not( '.disabled, .optgroup' ).addClass( 'selected' );	}
				} );
			}

			//
			if( next )
			{
				selected.nextAll( ).each( function( )
				{
					if( $( this ).is( '.selected' ) ) {	return false; }
					else { $( this ).not( '.disabled, .optgroup' ).addClass( 'selected' ); }
				} );
			}

			if( li.filter( '.selected' ).length === 1 )
			{
				selected.addClass( 'first' );
			}
		}

		// Отмечаем выбранные мышью
		optionList.prop( 'selected', false );

		//
		li.filter( '.selected' ).each( function( )
		{
			var t = $( this ),
				index = t.index( ) - ( t.is( '.option' ) ? t.prevAll( '.optgroup' ).length : 0 );

			optionList.eq( index ).prop( 'selected', true );
		} );

		//
		el.change( );
	} );

	// Отмечаем выбранные с клавиатуры
	optionList.each( function( i )
	{
		$( this ).data( 'optionIndex', i );
	} );

	// Реакция на смену пункта оригинального селекта
	el.on( 'change.' + pluginName, function( )
	{
		selectbox.triggerHandler( 'repaint' );
	} )
	// Фокусировка
	.on( 'focus.' + pluginName, function( )
	{
		selectbox.addClass( 'focused' );
	} )
	// Расфокусировка
	.on( 'blur.' + pluginName, function( )
	{
		selectbox.removeClass( 'focused' );
	} );

	// Прокручиваем с клавиатуры
	if( ulHeight > selectbox.height( ) )
	{
		el.on( 'keydown.' + pluginName, function( e )
		{
			// вверх, влево, PageUp
			if( e.which === 38 || e.which === 37 || e.which === 33 )
			{
				ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected' ).position( ).top - liHeight );
			}
			// вниз, вправо, PageDown
			if( e.which === 40 || e.which === 39 || e.which === 34 )
			{
				ul.scrollTop( ul.scrollTop( ) + li.filter( '.selected:last' ).position( ).top - ul.innerHeight( ) + liHeight * 2 );
			}
		} );
	}
	
	// Мы установили стиль, уведомляем об изменении
	selectbox.triggerHandler( 'repaint' );
}