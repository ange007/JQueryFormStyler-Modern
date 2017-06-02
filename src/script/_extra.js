// Определяем общего родителя у радиокнопок с одинаковым name
// http://stackoverflow.com/a/27733847
$.fn.commonParents = function( )
{
	let cachedThis = this;

	return cachedThis.first( ).parents( ).filter( function( )
	{
		return $( this ).find( cachedThis ).length === cachedThis.length;
	} );
};

$.fn.commonParent = function( )
{
	return $( this ).commonParents( ).first( );
};

// Прячем выпадающий список при клике за пределами селекта
function onDocumentClick( e )
{
	// e.target.nodeName != 'OPTION' - добавлено для обхода бага в Opera на движке Presto
	// (при изменении селекта с клавиатуры срабатывает событие onclick)
	if( !$( e.target ).parents( ).hasClass( 'jq-selectbox' ) && e.target.nodeName !== 'OPTION' )
	{
		if( $( 'div.jq-selectbox.opened' ).length )
		{
			//
			const selectbox = $( 'div.jq-selectbox.opened' ),
				search = $( 'div.jq-selectbox__search input', selectbox ),
				dropdown = $( 'div.jq-selectbox__dropdown', selectbox ),
				opt = selectbox.find( 'select' ).data( '_' + pluginName ).options.select || {};

			// колбек при закрытии селекта
			opt.onClosed.call( selectbox );

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