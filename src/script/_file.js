// Прячем оригинальное поле
el.addClass( 'jq-hidden' );

//
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
	
	// Формируем блок
	var file = $( '<div class="jq-file">' +
					'<div class="jq-file__name">' + placeholder + '</div>' +
					'<div class="jq-file__browse">' + browse + '</div>' +
					'</div>' )
				.attr( { 'id': att.id, 'title': att.title } )
				.addClass( att.classes )
				.data( att.data );
				
	// Добавляем блок 
	el.after( file ).appendTo( file );

	// 
	if( el.is( ':disabled' ) )
	{
		file.addClass( 'disabled' );
	}

	// Обработка "изменения" состояния
	el.on( 'change.' + pluginName, function( )
	{
		var value = el.val( ),
			name = $('div.jq-file__name', file);
		
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
	// Работа с "фокусировкой"
	.on( 'focus.' + pluginName, function( )
	{
		file.addClass( 'focused' );
	} )
	.on( 'blur.' + pluginName, function( )
	{
		file.removeClass( 'focused' );
	} )
	.on( 'click.' + pluginName, function( )
	{
		file.removeClass( 'focused' );
	} );
	
	// Мы установили стиль, уведомляем об изменении
	el.change( );
};

// Стилизируем компонент
fileOutput( );

// Обновление при динамическом изменении
el.on( 'refresh', function( )
{
	// Убираем стилизацию компонента
	el.off( '.' + pluginName )
		.removeClass( 'jq-hidden' )
		.parent( ).before( el ).remove( );
		
	// Стилизируем компонент снова
	fileOutput( );
} );