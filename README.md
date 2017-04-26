# jQuery FormStyler Modern  
[![Latest Stable Version](https://poser.pugx.org/ange007/jquery-formstyler-modern/v/stable)](https://packagist.org/packages/ange007/jquery-formstyler-modern)
[![Total Downloads](https://poser.pugx.org/ange007/jquery-formstyler-modern/downloads)](https://packagist.org/packages/ange007/jquery-formstyler-modern)
[![License](https://poser.pugx.org/ange007/jquery-formstyler-modern/license)](https://packagist.org/packages/ange007/jquery-formstyler-modern)
[![Build Status](https://travis-ci.org/ange007/JQueryFormStyler-Modern.svg?branch=dev)](https://travis-ci.org/ange007/JQueryFormStyler-Modern)

>Ответвление от плагина **jQueryFormStyler** 
*(оригинальный плагин: https://github.com/Dimox/jQueryFormStyler)*

- [Страница с примерами](http://ange007.github.io/JQueryFormStyler-Modern/)
- [Список изменений](https://github.com/ange007/JQueryFormStylerModern/blob/dev/CHANGES.md)
- [Скачать](https://github.com/ange007/JQueryFormStyler-Modern/releases)

## Описание
jQuery-плагин для стилизации элементов HTML-форм:
- `<input type="checkbox">`
- `<input type="radio">`
- `<input type="file">`
- `<input type="number">`
- `<input type="password">`
- `<select>`

## Подключение плагина
Сам плагин подключаетс посредством файла `jquery.formStylerModern.js`.
А подключение стилей на данный момент возможно в 2х вариантах:
- Подключение `jquery.formStylerModern.css`- который в себе содержит каркас и тему по умолчанию *(default)*
- Подключение файлов из директории `/theme/` - `jquery.formStylerModern.frame.css` *(каркас)* и одной из тем в той-же директории *(например `jquery.formStylerModern.flat.css`)*

## Работа с плагином
Стилизация компонентов
```javascript
	$( 'input, select, button' ).styler( {
		selectSearch: true,
		locale: 'ru',
		onFormStyled: function( ) 
		{ 
			...
		}
	} );
```

Перезагрузка элементов с определёнными настройками
```javascript
	$( '#checkbox-indeterminate-change' ).styler( 'reinitialize', { checkboxIndeterminate: true } );
```

Убрать стилизацию
```javascript
	$( 'input, select, button' ).styler( 'destroy' );
```

Перерисовка компонента после "ручного" изменения состояния
```javascript
	$( this ).prop( 'disabled', true )
			.trigger( 'repaint' );
```