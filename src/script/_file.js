let File = 
( function( )
{
	let File = function( element, options, locale ) 
	{		
		//
		this.element = element;
		this.options = options;
		this.locale = locale;
		
		//
		this.placeholderText = this.element.data( 'placeholder' ) || locale[ 'placeholder' ];
		this.browseText = this.element.data( 'browse' ) || locale[ 'browse' ];
				
		// Формируем компонент
		const att = new Attributes( this.element );
		
		//
		this.file = $( '<div class="jq-file">' +
						'<div class="jq-file__name">' + this.placeholderText + '</div>' +
						'<div class="jq-file__browse">' + this.browseText + '</div>' +
						'</div>' )
					.attr( { 'id': att.id, 'title': att.title } )
					.addClass( att.classes )
					.data( att.data );

		// Прячем оригинальное поле
		this.element.addClass( 'jq-hidden' )
					.after( this.file ).appendTo( this.file );						
			
		//
		this.setEvents( )
			.repaint( );
	};
	
	File.prototype = 
	{
		// Обработка событий
		setEvents: function( )
		{
			const context = this,
				element = this.element,
				file = this.file;
			
			// Необходимо "перерисовать" контрол 
			file.on( 'repaint', function( )
			{
				context.repaint( );
			} );

			// Обработка "изменения" состояния
			element.on( 'change.' + pluginName, function( )
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
			
			return this;
		},
		
		// Перерисовка
		repaint: function( )
		{
			const element = this.element,
				file = this.file,
				options = this.options,
				name = $( 'div.jq-file__name', file );

			//
			let value = element.val( );

			// Если необходим множественный выбор
			if( element.is( '[multiple]' ) )
			{
				let fileCount = element[ 0 ].files.length;

				if( fileCount > 0 )
				{
					value = ( element.data( 'number' ) || options.counter ).replace( '%s', fileCount );
				}
				else
				{
					value = '';
				}
			}

			// Выводим название файлов или примечание
			name.text( value.replace( /.+[\\\/]/, '' ) || this.placeholderText );

			// Активация/деактивация
			file.toggleClass( 'changed', ( value !== '' ) )
				.toggleClass( 'disabled', element.is( ':disabled' ) );
			
			return this;
		},
		
		// Уничтожение
		destroy: function( )
		{
			const element = this.element;
			
			element.off( '.' + pluginName + ', refresh' )
					.removeAttr( 'style' )
					.parent( ).before( element ).remove( );
			
			return this;
		}
	}
	
	return File;
} )( );