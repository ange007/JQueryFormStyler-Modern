# jQuery FormStyler Modern  [![Build Status](https://travis-ci.org/ange007/JQueryFormStylerModern.svg?branch=dev)](https://travis-ci.org/ange007/JQueryFormStylerModern)
**Форк плагина для стилизации элементов HTML-форм.**

***Оригинальный плагин: https://github.com/Dimox/jQueryFormStyler***

jQuery-плагин для стилизации элементов HTML-форм:

- `<input type="checkbox">`
- `<input type="radio">`
- `<input type="file">`
- `<input type="number">`
- `<select>`

## Структурные отличия от репозитория оригинала:

- ~~Более удобное форматирование кода для изучения исходников~~
- ~~Разбивка плагина на части~~
- ~~Cборка проекта при помощи Gulp~~
- Автоматизация сборки через Travis-CI ***(в планах)***

## Изменения кодовой базы:
* Добавлена *"защита от дурака"* в случае повторной инициализации плагина на элементах. При инициализации элемента через плагин - ему добавляется класс указанный в **options.idSuffix**, по нему в будущем и идёт проверка на то "стилизован" элемент, или нет.
* Добавлено состояние **"не определено"** для **input:checkbox**. Так-же возможна установка данного состояния автоматически при включенной опции 
```
options.checkboxIndeterminate.
```
* Добавлена функция "переинициализации" элемента с новыми настройками *( например если нужно стилизовать все элементы, но один из них со спец.настройками )*
```javascript
$(el).styler( 'reinitialize', { checkboxIndeterminate: true } );
```
* Группы ***input:radio*** работают так-же и "вне" **form**. 
В этом случае поиск элементов **input:radio** происходит по всей форме исходя из параметра **name** у радиокнопки.
* Прочие небольшие правки

## Ссылки
- [Оригинальный плагин](https://github.com/Dimox/jQueryFormStyler/)
- [Страница с примерами оригинального плагина](http://dimox.github.io/jQueryFormStyler/demo/)
- [Домашняя страница оригинального плагина](http://dimox.name/jquery-form-styler/)
- [Оригинальный плагин в CDN jsDelivr](http://www.jsdelivr.com/#!jquery.formstyler)
