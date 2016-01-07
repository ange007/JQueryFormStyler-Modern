	// Прячем выпадающий список при клике за пределами селекта
	function onDocumentClick( e )
	{
		// e.target.nodeName != 'OPTION' - добавлено для обхода бага в Opera на движке Presto
		// (при изменении селекта с клавиатуры срабатывает событие onclick)
		if( !$( e.target ).parents( ).hasClass( '' + classPrefix + 'selectbox' ) && e.target.nodeName !== 'OPTION' )
		{
			if( $( 'div.' + classPrefix + 'selectbox.opened' ).length )
			{
				//
				var selectbox = $( 'div.' + classPrefix + 'selectbox.opened' ),
					search = $( 'div.' + classPrefix + 'selectbox__search input', selectbox ),
					dropdown = $( 'div.' + classPrefix + 'selectbox__dropdown', selectbox ),
					opt = selectbox.find( 'select' ).data( '_' + pluginName ).options;

				// колбек при закрытии селекта
				opt.onSelectClosed.call( selectbox );

				//
				if( search.length )
				{
					search.val( '' ).keyup( );
				}
				
				//
				dropdown.hide( )
						.find( 'li.sel' ).addClass( 'selected' );
				
				//
				selectbox.removeClass( 'focused opened dropup dropdown' );
			}
		}
	}
	
	onDocumentClick.registered = false;