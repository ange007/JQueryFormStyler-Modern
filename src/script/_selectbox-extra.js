let SelectBoxExtra = 
( function( )
{
	return {
		initEvent: false,
		
		// Инициализация спец. обработчиков
		init: function( )
		{
			this.initEvent = true;
						
			// Прячем выпадающий список при клике за пределами селекта
			$( document ).on( 'click', function( event )
			{
				// e.target.nodeName != 'OPTION' - добавлено для обхода бага в Opera на движке Presto
				// (при изменении селекта с клавиатуры срабатывает событие onclick)
				if( !$( event.target ).parents( ).hasClass( 'jq-selectbox' ) && event.target.nodeName !== 'OPTION' && $( '.jq-selectbox.opened' ).length )
				{
					$( '.jq-selectbox.opened' ).triggerHandler( 'dropdown:close' );
				}
			} );
			
			// Скрытие выпадающего списка при фокусе на стороннем элементе
			$( document ).on( 'focus', 'select, input, textarea, button, a', function( event )
			{
				var focusedSelect = $( '.jq-selectbox.opened' ),
					currentSelect = $( event.currentTarget ).parents( '.jq-selectbox' );

				if( focusedSelect.get( 0 ) === currentSelect.get( 0 ) )
				{
					return;
				}

				// Скрываем выпадающий список
				focusedSelect.triggerHandler( 'dropdown:close' );
			} );			
		},

		// Запрещаем прокрутку страницы при прокрутке селекта
		preventScrolling: function( selector )
		{
			const scrollDiff = selector.prop( 'scrollHeight' ) - selector.outerHeight( );

			//
			let wheelDelta = null,
				scrollTop = null;

			// 
			selector.off( 'mousewheel DOMMouseScroll' )
					.on( 'mousewheel DOMMouseScroll', function( e )
			{
				wheelDelta = ( e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0 ) ? 1 : -1; // Направление прокрутки (-1 вниз, 1 вверх)
				scrollTop = selector.scrollTop( ); // Позиция скролла

				if( ( scrollTop >= scrollDiff && wheelDelta < 0 ) || ( scrollTop <= 0 && wheelDelta > 0 ) ) 
				{
					e.stopPropagation( );
					e.preventDefault( );
				}
			} );
			
			return this;
		},

		// Формируем список селекта
		makeList: function( opList )
		{
			let list = $( '<ul>' );

			// Перебираем список элементов
			for( let i = 0; i < opList.length; i++ )
			{					
				const op = opList.eq( i ),
					id = ( op.attr( 'id' ) || '' ) !== '' ? ( op.attr( 'id' ) + idSuffix ) : '',
					title = op.attr( 'title' );

				let liClass = op.attr( 'class' ) || '';

				if( op.is( ':selected' ) )
				{
					liClass += ( liClass !== '' ? ' ' : '' ) + 'selected sel';
				}

				if( op.is( ':disabled' ) )
				{
					liClass += ( liClass !== '' ? ' ' : '' ) + 'disabled';
				}

				// Параметры по умолчанию
				let defaultAttr = { 'title': title,
									'data': op.data( ),
									'html': op.html( ) };

				// Добавляем к пункту идентификатор если он есть
				if( id !== '' )
				{
					defaultAttr[ 'id' ] = id;
				}

				// Если есть optgroup
				if( op.parent( ).is( 'optgroup' ) )
				{
					let optGroupClass = '';

					//
					if( op.parent( ).attr( 'class' ) !== undefined )
					{
						optGroupClass = ' ' + op.parent( ).attr( 'class' );
					}

					// Заголовок группы
					if( op.is( ':first-child' ) )
					{
						$( '<li>', { 'class': 'optgroup' + optGroupClass,
									'html': op.parent( ).attr( 'label' ) } )
						.appendTo( list );
					}

					// Создаём пункт для группы
					$( '<li>', $.extend( defaultAttr, { 'class': 'option' } ) )
						.addClass( liClass )
						.addClass( optGroupClass )
						.data( 'jqfs-class', op.attr( 'class' ) )
						.appendTo( list );
				}
				else
				{
					// Создаём пункт
					$( '<li>', defaultAttr )
						.addClass( liClass )	
						.data( 'jqfs-class', op.attr( 'class' ) )
						.appendTo( list );
				}
			}

			return list;
		}
	};
} )( );