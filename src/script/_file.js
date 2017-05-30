var fileOutput = function( el )
{
	// Параметры
	var params = this.options.file || { },
		locale = this.locales.file || { };
	
	// Формируем компонент
	var att = new Attributes( el ), 
		placeholder = el.data( 'placeholder' ) || locale[ 'placeholder' ],
		browse = el.data( 'browse' ) || locale[ 'browse' ];
		
	// Формируем блок
	var file = $( '<div class="jq-file">' +
					'<div class="jq-file__name">' + placeholder + '</div>' +
					'<div class="jq-file__browse">' + browse + '</div>' +
					'</div>' )
				.attr( { 'id': att.id, 'title': att.title } )
				.addClass( att.classes )
				.data( att.data );
	
	// Прячем оригинальное поле
	el.addClass( 'jq-hidden' )
		.after( file ).appendTo( file );

	// Необходимо "перерисовать" контрол 
	file.on( 'repaint', function( )
	{
		var value = el.val( ),
			name = $('div.jq-file__name', file);
				
		// 
		if( el.is( '[multiple]' ) )
		{
			var files = el[0].files.length;
			value = '';
			
			if( files > 0 )
			{
				var number = el.data( 'number' ) || params.counter;

				number = number.replace( '%s', files );
				value = number;
			}
		}
				
		// Выводим название файлов или примечание
		name.text( value.replace( /.+[\\\/]/, '' ) || placeholder );
		
		// Активация/деактивация
		file.toggleClass( 'changed', ( value !== '' ) );
		
		// Активация/деактивация
		file.toggleClass( 'disabled', el.is( ':disabled' ) );
	} );

	// Обработка "изменения" состояния
	el.on( 'change.' + pluginName, function( )
	{
		file.triggerHandler( 'repaint' );
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
	file.triggerHandler( 'repaint' );
};

// Стилизируем компонент
fileOutput.call( this, element );