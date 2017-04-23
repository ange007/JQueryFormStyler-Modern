# jQuery FormStyler Modern  [![Build Status](https://travis-ci.org/ange007/JQueryFormStyler-Modern.svg?branch=dev)](https://travis-ci.org/ange007/JQueryFormStyler-Modern)
>Ответвление от плагина **jQueryFormStyler** 
*( оригинальный плагин: https://github.com/Dimox/jQueryFormStyler )*

- [Страница с примерами](http://ange007.github.io/JQueryFormStyler-Modern/)
- [Список изменений](https://github.com/ange007/JQueryFormStylerModern/blob/dev/CHANGES.md)
- [Скачать](https://github.com/ange007/JQueryFormStyler-Modern/releases)

## Описание
jQuery-плагин для стилизации элементов HTML-форм:
- `<input type="checkbox">`
- `<input type="radio">`
- `<input type="file">`
- `<input type="number">`
- `<select>`

## Подключение плагина
Сам плагин подключаетс посредством файла `jquery.formStylerModern.js`.
А подключение стилей на данный момент возможно в 2х вариантах:
- Подключение `jquery.formStylerModern.css`- который в себе содержит каркас и тему по умолчанию *(default)*
- Подключение файлов из директории `/theme/` - `jquery.formStylerModern.frame.css` *(каркас)* и одной из тем в той-же директории *(например `jquery.formStylerModern.flat.css`)*

## Структурные отличия от репозитория оригинала:
- Разделение на **dev** и **master** ветки
- Разбивка плагина на части
- Разделение каркаса и стилей плагина
- Cборка проекта при помощи **Gulp**
- Автоматизация сборки через **Travis-CI**

## Ссылки
- [Оригинальный плагин](https://github.com/Dimox/jQueryFormStyler/)