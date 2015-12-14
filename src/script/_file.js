// прячем оригинальное поле
el.css( {
	position: 'absolute',
	top: 0,
	right: 0,
	width: '100%',
	height: '100%',
	opacity: 0,
	margin: 0,
	padding: 0
} );

var fileOutput = function( )
{
	var att = new Attributes( ), 
		placeholder = el.data( 'placeholder' ),
		browse = el.data( 'browse' );
		
	if( placeholder === undefined )
	{
		placeholder = opt.filePlaceholder;
	}

	if( browse === undefined || browse === '' )
	{
		browse = opt.fileBrowse;
	}
	
	var file = $( '<div' + att.id + ' class="jq-file' + att.classes + '"' + att.title + ' style="display: inline-block; position: relative; overflow: hidden"></div>' ),
		name = $( '<div class="jq-file__name">' + placeholder + '</div>' ).appendTo( file );

	$( '<div class="jq-file__browse">' + browse + '</div>' ).appendTo( file );
	el.after( file ).appendTo( file );

	if( el.is( ':disabled' ) )
	{
		file.addClass( 'disabled' );
	}

	el.on( 'change.styler', function()
	{
		var value = el.val( );
		
		if( el.is( '[multiple]' ) )
		{
			var files = el[0].files.length;
			value = '';
			
			if( files > 0 )
			{
				var number = el.data( 'number' );
				
				if( number === undefined )
				{
					number = opt.fileNumber;
				}
				
				number = number.replace( '%s', files );
				value = number;
			}
		}
		name.text( value.replace( /.+[\\\/]/, '' ) );
		if( value === '' )
		{
			name.text( placeholder );
			file.removeClass( 'changed' );
		} 
		else
		{
			file.addClass( 'changed' );
		}
	} )
	//
	.on( 'focus.styler', function()
	{
		file.addClass( 'focused' );
	} )
	//
	.on( 'blur.styler', function()
	{
		file.removeClass( 'focused' );
	} )
	//
	.on( 'click.styler', function()
	{
		file.removeClass( 'focused' );
	} );

};

// 
fileOutput( );

// обновление при динамическом изменении
el.on( 'refresh', function( )
{
	el.off( '.styler' ).parent().before( el ).remove();
	fileOutput();
} );