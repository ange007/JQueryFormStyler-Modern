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