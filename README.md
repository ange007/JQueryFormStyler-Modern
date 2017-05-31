# jQuery FormStyler Modern <sup>[2.0.0](https://github.com/ange007/JQueryFormStylerModern/blob/dev/CHANGELOG.md)</sup> 
[![Latest Stable Version](https://poser.pugx.org/ange007/jquery-formstyler-modern/v/stable)](https://packagist.org/packages/ange007/jquery-formstyler-modern)
[![Total Downloads](https://poser.pugx.org/ange007/jquery-formstyler-modern/downloads)](https://packagist.org/packages/ange007/jquery-formstyler-modern)
[![License](https://poser.pugx.org/ange007/jquery-formstyler-modern/license)](https://packagist.org/packages/ange007/jquery-formstyler-modern)
[![Build Status](https://travis-ci.org/ange007/JQueryFormStyler-Modern.svg?branch=dev)](https://travis-ci.org/ange007/JQueryFormStyler-Modern)

>Самостоятельное ответвление от плагина **jQueryFormStyler** 
*(оригинальный плагин: https://github.com/Dimox/jQueryFormStyler)*

- [Страница с примерами](http://ange007.github.io/JQueryFormStyler-Modern/)
- [Список изменений](https://github.com/ange007/JQueryFormStylerModern/blob/dev/CHANGELOG.md)
- [Скачать](https://github.com/ange007/JQueryFormStyler-Modern/releases)

## Описание
jQuery-плагин для стилизации элементов HTML-форм:
- `<input type="checkbox">`
- `<input type="radio">`
- `<input type="file">`
- `<input type="number">`
- `<input type="password">`
- `<select>`

## Внимание!
Структура настроек плагина версии **2.x** - отличаются от настроек [оригинального](https://github.com/Dimox/jQueryFormStyler) и версии [1.x](https://github.com/ange007/JQueryFormStyler-Modern/tree/1.x---release) данного плагина.

## Подключение плагина
Сам плагин подключаетс посредством файла `jquery.formStylerModern.js`.
А подключение стилей возможно в 2х вариантах:
- Подключение `jquery.formStylerModern.css`- который в себе содержит каркас и тему по умолчанию *(default)*
- Подключение файлов из директории `/style/` - `jquery.formStylerModern.frame.css` *(каркас)* и одной из тем в той-же директории *(например `jquery.formStylerModern.flat.css`)*

## Работа с плагином
Стилизация компонентов
```javascript
	$( 'input, select, button' ).styler( 
	{
		locale: 'ru',
		select: { 
			search: {
				limit: 10
			}
		},
		onFormStyled: function( ) 
		{ 
			...
		}
	} );
```

Перезагрузка элементов с определёнными настройками
```javascript
	$( '#checkbox-indeterminate-change' ).styler( 'reinitialize', { checkbox: { indeterminate: true } } );
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