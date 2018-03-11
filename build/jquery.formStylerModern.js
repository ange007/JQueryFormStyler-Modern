/**
 * jquery.formstyler-modern - JQuery HTML form styling plugin
 * @version v2.1.2
 * @link https://github.com/ange007/JQueryFormStyler-Modern
 * @license MIT
 * @author Borisenko Vladimir
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

;(function (factory) {
	// AMD
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	}
	// CommonJS
	else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
			module.exports = factory($ || require('jquery'));
		}
		// 
		else {
				factory(jQuery);
			}
})(function ($) {
	'use strict';

	/* Имя плагина. Используется для вызова плагина, 
  * а так-же в качестве класса для 
  * стилизации без "псевдо-компонентов" */

	var pluginName = 'styler';

	// Суффикс - который подставляется к ID "псевдо-компонента"
	var idSuffix = '-' + pluginName;

	// Параметры по умолчанию
	var defaults = {
		locale: navigator.browserLanguage || navigator.language || navigator.userLanguage || 'en-US',

		select: {
			search: {
				limit: 10,
				ajax: undefined
			},
			triggerHTML: '<div class="jq-selectbox__trigger-arrow"></div>',
			visibleOptions: 0,
			smartPosition: true,
			onOpened: function onOpened() {},
			onClosed: function onClosed() {}
		},
		checkbox: {
			indeterminate: false
		},
		password: {
			switchHTML: '<button type="button" class="' + pluginName + '"></button>'
		},
		number: {
			horizontal: false
		},

		onFormStyled: function onFormStyled() {}
	};

	// Локализация
	var locales = {
		// English
		'en-US': {
			file: {
				placeholder: 'No file selected',
				browse: 'Browse...',
				counter: 'Selected files: %s'
			},
			select: {
				placeholder: 'Select...',
				search: {
					notFound: 'No matches found',
					placeholder: 'Search...'
				}
			},
			password: {
				show: '&#10687;',
				hide: '&#10686;'
			}
		},

		// Русский
		'ru-RU': {
			file: {
				placeholder: 'Файл не выбран',
				browse: 'Обзор...',
				counter: 'Выбрано файлов: %s'
			},
			select: {
				placeholder: 'Выберите...',
				search: {
					notFound: 'Совпадений не найдено',
					placeholder: 'Поиск...'
				}
			}
		},

		// Українська
		'uk-UA': {
			file: {
				placeholder: 'Файл не обрано',
				browse: 'Огляд...',
				counter: 'Обрано файлів: %s'
			},
			select: {
				placeholder: 'Виберіть...',
				search: {
					notFound: 'Збігів не знайдено',
					placeholder: 'Пошук...'
				}
			}
		}
	};

	// Добавляем синонимы языковых кодов
	locales['en'] = locales['en-US'];
	locales['ru'] = locales['ru-RU'];
	locales['ua'] = locales['uk-UA'];

	// Атрибуты елемента
	function Attributes(element) {
		if (element.attr('id') !== undefined && element.attr('id') !== '') {
			this.id = element.attr('id') + idSuffix;
		}

		this.title = element.attr('title');
		this.classes = (element.attr('class') || '') + ' ' + pluginName;
		this.data = element.data();
	}

	// Конструктор плагина
	function Plugin(element, options) {
		// Запоминаем єлемент
		this.element = element;
		this.customElement = undefined;

		// Настройки
		this.options = $.extend(true, {}, defaults, options);

		// Расширяем английскую локализацию - выборанной локализацией из параметров
		var mainLocale = $.extend(true, {}, locales['en-US'], locales[this.options.locale]);

		// Расширяем полученный словарь словами переданными через настройки
		this.locales = $.extend(true, {}, mainLocale, this.options.locales);

		// Инициаплизация
		this.init();
	}

	// Расширение функционала плагина
	Plugin.prototype = {
		// Инициализация
		init: function init() {
			var context = this,
			    element = $(this.element);

			// Определение мобильного браузера
			var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/i) && !navigator.userAgent.match(/(Windows\sPhone)/i),
			    Android = navigator.userAgent.match(/Android/i) && !navigator.userAgent.match(/(Windows\sPhone)/i),
			    IE = navigator.userAgent.match(/(MSI|Windows\sPhone|Trident(?=\/))/i);

			// Чекбокс
			if (element.is(':checkbox')) {
				var CheckBox = function () {
					var Component = function Component(element, options, locale) {
						//
						this.element = element;
						this.options = options;
						this.locale = locale;

						//
						var attr = new Attributes(this.element);

						//
						this.checkbox = $('<div class="jq-checkbox"><div class="jq-checkbox__div"></div></div>').attr({ 'id': attr.id, 'title': attr.title, 'unselectable': 'on' }).addClass(attr.classes).data(attr.data);

						// Прячем оригинальный чекбокс
						this.element.addClass('jq-hidden').after(this.checkbox).prependTo(this.checkbox);

						//
						this.setEvents().repaint();
					};

					Component.prototype = {
						// Обработка событий
						setEvents: function setEvents() {
							var context = this,
							    options = this.options,
							    element = this.element,
							    checkbox = this.checkbox;

							// Необходимо "перерисовать" контрол 
							checkbox.on('repaint', function () {
								context.repaint();
							})
							// Клик по псевдоблоку ( смена состояния )
							.on('click', function (e) {
								e.preventDefault();

								// Обрабатываем только активный псевдобокс
								if (!checkbox.is('.disabled')) {
									// Текущее состояние: "Отмечено"
									if (element.is(':checked') || element.is(':indeterminate')) {
										// ... если работаем через 3 состояния - отмечаем "не определено",  или просто снимаем отметку
										element.prop('checked', options.indeterminate && element.is(':indeterminate'));

										// "Неопределено" в любом случае снимаем
										element.prop('indeterminate', false);
									}
									// Текущее состояние: "Не отмечено"
									else {
											// ... если работаем через 3 состояния - отмечаем "не определено"
											if (options.indeterminate) {
												element.prop('checked', false).prop('indeterminate', true);
											}
											// ... или просто отмечаем
											else {
													element.prop('checked', true).prop('indeterminate', false);
												}
										}

									// Фокусируем и изменяем вызываем состояние изменения
									element.focus().trigger('change').triggerHandler('click');
								}
							});

							// Клик по label привязанному к данному checkbox
							element.closest('label').add('label[for="' + this.element.attr('id') + '"]').on('click.' + pluginName, function (e) {
								if (!$(e.target).is('a') && !$(e.target).closest(checkbox).length) {
									checkbox.triggerHandler('click');
									e.preventDefault();
								}
							});

							// Обработка изменений
							element.on('change.' + pluginName, function () {
								checkbox.triggerHandler('repaint');
							})
							// Обработка переключения при помощи клавиатуры
							.on('keydown.' + pluginName, function (e) {
								if (e.which === 32) {
									e.preventDefault();
									checkbox.triggerHandler('click');
								}
							})
							// Обработка наведения фокуса
							.on('focus.' + pluginName, function () {
								if (!checkbox.is('.disabled')) {
									checkbox.addClass('focused');
								}
							})
							// Обработка снятия фокуса
							.on('blur.' + pluginName, function () {
								checkbox.removeClass('focused');
							});

							return this;
						},

						// Перерисовка
						repaint: function repaint() {
							var element = this.element,
							    checkbox = this.checkbox;

							// Отмечено
							if (element.is(':checked') || element.is(':indeterminate')) {
								if (element.is(':indeterminate')) {
									checkbox.removeClass('checked').addClass('indeterminate');
								} else {
									checkbox.removeClass('indeterminate').addClass('checked');
								}
							}
							// Не отмечено
							else {
									checkbox.removeClass('indeterminate').removeClass('checked');
								}

							// Активация/деактивация
							checkbox.toggleClass('disabled', element.is(':disabled'));

							return this;
						},

						// Уничтожение
						destroy: function destroy() {
							var element = this.element;

							//
							element.off('.' + pluginName + ', refresh').removeAttr('style').parent().before(element).remove();

							//
							element.closest('label').add('label[for="' + element.attr('id') + '"]').off('.' + pluginName);

							return this;
						}
					};

					return Component;
				}();

				this.customElement = new CheckBox(element, this.options.checkbox, this.locales.checkbox);
			}
			// Радиокнопка
			else if (element.is(':radio')) {
					var Radio = function () {
						var Component = function Component(element, options, locale) {
							//
							this.element = element;
							this.options = options;
							this.locale = locale;

							//
							var attr = new Attributes(this.element);

							//
							this.radio = $('<div class="jq-radio"><div class="jq-radio__div"></div></div>').attr({ 'id': attr.id, 'title': attr.title, 'unselectable': 'on' }).addClass(attr.classes).data(attr.data);

							// Прячем оригинальную радиокнопку
							this.element.addClass('jq-hidden').after(this.radio).prependTo(this.radio);

							//
							this.setEvents().repaint();
						};

						Component.prototype = {
							// Обработка событий
							setEvents: function setEvents() {
								var context = this,
								    element = this.element,
								    radio = this.radio;

								// Необходимо "перерисовать" контрол 
								radio.on('repaint', function () {
									context.repaint();
								})
								// Клик по псевдоблоку
								.on('click', function (e) {
									//
									e.preventDefault();

									// Обрабатываем только активную радиокнопку
									if (!radio.is('.disabled')) {
										// 
										var name = element.attr('name');

										// Ищем нужный нам елемент по родителям
										var findElement = radio.closest('#' + name).find('input[name="' + name + '"]:radio');

										// ... или же по всему документу
										if (findElement.length <= 0) {
											findElement = $('body').find('input[name="' + name + '"]:radio');
										}

										// Снимаем отметку с найденного блока
										findElement.prop('checked', false).parent().removeClass('checked');

										// Передаём фокус и вызываем событие - изменения
										element.prop('checked', true).focus().trigger('change').triggerHandler('click');
									}
								});

								// Обработка изменений
								element.on('change.' + pluginName, function () {
									radio.triggerHandler('repaint');
								})
								// Обработка переключения при помощи клавиатуры
								.on('keydown.' + pluginName, function (e) {
									if (e.which === 32) {
										e.preventDefault();
										radio.trigger('click');
									}
								})
								// Обработка наведения фокуса
								.on('focus.' + pluginName, function () {
									if (!radio.is('.disabled')) {
										radio.addClass('focused');
									}
								})
								// Обработка снятия фокуса
								.on('blur.' + pluginName, function () {
									radio.removeClass('focused');
								});

								// Клик на label
								element.closest('label').add('label[for="' + element.attr('id') + '"]').on('click.' + pluginName, function (e) {
									if (!$(e.target).is('a') && !$(e.target).closest(radio).length) {
										radio.triggerHandler('click');
										e.preventDefault();
									}
								});

								return this;
							},

							// Перерисовка
							repaint: function repaint() {
								var element = this.element,
								    radio = this.radio;

								// Отметка
								element.parent().toggleClass('checked', element.is(':checked'));

								// Активация/деактивация
								radio.toggleClass('disabled', element.is(':disabled'));

								return this;
							},

							// Уничтожение
							destroy: function destroy() {
								var element = this.element;

								//
								element.off('.' + pluginName + ', refresh').removeAttr('style').parent().before(element).remove();

								//
								element.closest('label').add('label[for="' + element.attr('id') + '"]').off('.' + pluginName);

								return this;
							}
						};

						return Component;
					}();

					this.customElement = new Radio(element, this.options.radio, this.locales.radio);
				}
				// Выбор файла
				else if (element.is(':file')) {
						var File = function () {
							var Component = function Component(element, options, locale) {
								//
								this.element = element;
								this.options = options;
								this.locale = locale;

								//
								this.placeholderText = this.element.data('placeholder') || locale['placeholder'];
								this.browseText = this.element.data('browse') || locale['browse'];

								// Формируем компонент
								var att = new Attributes(this.element);

								//
								this.file = $('<div class="jq-file">' + '<div class="jq-file__name">' + this.placeholderText + '</div>' + '<div class="jq-file__browse">' + this.browseText + '</div>' + '</div>').attr({ 'id': att.id, 'title': att.title }).addClass(att.classes).data(att.data);

								// Прячем оригинальное поле
								this.element.addClass('jq-hidden').after(this.file).appendTo(this.file);

								//
								this.setEvents().repaint();
							};

							Component.prototype = {
								// Обработка событий
								setEvents: function setEvents() {
									var context = this,
									    element = this.element,
									    file = this.file;

									// Необходимо "перерисовать" контрол 
									file.on('repaint', function () {
										context.repaint();
									});

									// Обработка "изменения" состояния
									element.on('change.' + pluginName, function () {
										file.triggerHandler('repaint');
									})
									// Работа с "фокусировкой"
									.on('focus.' + pluginName, function () {
										file.addClass('focused');
									}).on('blur.' + pluginName, function () {
										file.removeClass('focused');
									}).on('click.' + pluginName, function () {
										file.removeClass('focused');
									});

									return this;
								},

								// Перерисовка
								repaint: function repaint() {
									var element = this.element,
									    file = this.file,
									    options = this.options,
									    name = $('div.jq-file__name', file);

									//
									var value = element.val();

									// Если необходим множественный выбор
									if (element.is('[multiple]')) {
										var fileCount = element[0].files.length;

										if (fileCount > 0) {
											value = (element.data('number') || options.counter).replace('%s', fileCount);
										} else {
											value = '';
										}
									}

									// Выводим название файлов или примечание
									name.text(value.replace(/.+[\\\/]/, '') || this.placeholderText);

									// Активация/деактивация
									file.toggleClass('changed', value !== '').toggleClass('disabled', element.is(':disabled'));

									return this;
								},

								// Уничтожение
								destroy: function destroy() {
									var element = this.element;

									element.off('.' + pluginName + ', refresh').removeAttr('style').parent().before(element).remove();

									return this;
								}
							};

							return Component;
						}();

						this.customElement = new File(element, this.options.file, this.locales.file);
					}
					// Номер
					else if (element.is('input[type="number"]')) {
							var _Number = function () {
								var Component = function Component(element, options, locale) {
									//
									this.element = element;
									this.options = options;
									this.locale = locale;

									//
									var attr = new Attributes(this.element);

									//
									this.number = $('<div class="jq-number">' + '<div class="jq-number__spin minus"></div>' + '<div class="jq-number__spin plus"></div>' + '</div>').attr({ 'id': attr.id, 'title': attr.title }).addClass(attr.classes).data(attr.data);

									// Прячем оригинальный элемент
									this.element.after(this.number).prependTo(this.number).wrap('<div class="jq-number__field"></div>');

									// При необходимости добавляем горизонтальный стиль отрисовки
									if (this.options.horizontal) {
										this.number.addClass('horizontal');
									}

									// Навешиваем события и отрисовываем
									this.setEvents().repaint();
								};

								Component.prototype = {
									// Обработка событий
									setEvents: function setEvents() {
										var context = this,
										    element = this.element,
										    num = this.number;

										var timeout = null,
										    interval = null;

										// Необходимо "перерисовать" контрол
										num.on('repaint', function () {
											context.repaint();
										})
										//
										.on('mousedown', 'div.jq-number__spin', function () {
											if (element.is(':disabled')) {
												return;
											}

											var spin = $(this);
											context.changeValue(spin);

											timeout = setTimeout(function () {
												interval = setInterval(function () {
													context.changeValue(spin);
												}, 40);
											}, 350);
										})
										//
										.on('mouseup mouseout', 'div.jq-number__spin', function () {
											if (element.is(':disabled')) {
												return;
											}

											clearTimeout(timeout);
											clearInterval(interval);
										});

										// Фокусировка
										element.on('focus.' + pluginName, function () {
											num.addClass('focused');
										})
										// Расфокусировка
										.on('blur.' + pluginName, function () {
											num.removeClass('focused');
										});

										return this;
									},

									// Перерисовка
									repaint: function repaint() {
										this.number.toggleClass('disabled', this.element.is(':disabled'));

										return this;
									},

									//
									changeValue: function changeValue(button) {
										var element = this.element;

										//
										var min = element.attr('min') || undefined,
										    max = element.attr('max') || undefined,
										    step = parseFloat(element.attr('step')) || 1;

										//
										var value = $.isNumeric(element.val()) ? element.val() : 0,
										    newValue = parseFloat(value) + (button.is('.plus') ? step : -step);

										// Определяем количество десятичных знаков после запятой в step
										var decimals = (step.toString().split('.')[1] || []).length.prototype;
										var multiplier = '1';

										if (decimals > 0) {
											while (multiplier.length <= decimals) {
												multiplier = multiplier + '0';
											}

											// Избегаем появления лишних знаков после запятой
											newValue = Math.round(newValue * multiplier) / multiplier;
										}

										if ($.isNumeric(min) && $.isNumeric(max)) {
											if (newValue >= min && newValue <= max) {
												element.val(newValue).change();
											}
										} else if ($.isNumeric(min) && !$.isNumeric(max)) {
											if (newValue >= min) {
												element.val(newValue).change();
											}
										} else if (!$.isNumeric(min) && $.isNumeric(max)) {
											if (newValue <= max) {
												element.val(newValue).change();
											}
										} else {
											element.val(newValue).change();
										}

										return this;
									},

									// Уничтожение
									destroy: function destroy() {
										var element = this.element;

										element.off('.' + pluginName + ', refresh').closest('.jq-number').before(element).remove();

										return this;
									}
								};

								return Component;
							}();

							this.customElement = new _Number(element, this.options.number, this.locales.number);
						}
						// Пароль
						else if (element.is('input[type="password"]') && !element.is('[nobutton]') && this.options.password.switchHTML !== undefined && this.options.password.switchHTML !== 'none') {
								var Password = function () {
									var Component = function Component(element, options, locale) {
										//
										this.element = element;
										this.options = options;
										this.locale = locale;

										//
										var customButton = $('<div class="jq-password__switch">' + (this.options.switchHTML || '') + '</div>');

										//
										this.password = $('<div class="jq-password">').append(customButton);
										this.button = customButton.children('button').length > 0 ? customButton.children('button') : customButton;

										// Есть ли текст в блоке, и нужно ли его ставить
										if (this.button.html() === '' && locale['show'] !== '') {
											this.button.html(locale['show']);

											// Если был вставлен только текст
											if (customButton.children('button').length <= 0) {
												customButton.addClass('jq-password__switch-text');
											}
										}

										//
										this.element.after(this.password).prependTo(this.password);

										//
										this.setEvents().repaint();
									};

									Component.prototype = {
										setEvents: function setEvents() {
											var locale = this.locale,
											    element = this.element,
											    password = this.password,
											    button = this.button;

											// Необходимо "перерисовать" контрол
											password.on('repaint', function () {
												// Активация/деактивация
												password.toggleClass('disabled', element.is(':disabled'));

												// Активация/деактивация кнопки
												button.prop('disabled', element.is(':disabled'));
											})
											// Реакция на клик по кнопке
											.on('click', '.jq-password__switch', function () {
												var switcher = $(this),
												    wrapper = switcher.closest('.jq-password'),
												    seen = wrapper.is('.jq-password_seen');

												// Добавление/удаление класса
												wrapper.toggleClass('jq-password_seen', !seen);

												// Меняем текст
												if (locale['show'] !== '' && locale['hide'] !== '') {
													button.html(seen ? locale['show'] : locale['hide']);
												}

												//
												element.attr('type', seen ? 'password' : 'text');
											});

											// Фокусировка
											element.on('focus.' + pluginName, function () {
												password.addClass('focused');
											})
											// Расфокусировка
											.on('blur.' + pluginName, function () {
												password.removeClass('focused');
											});

											return this;
										},

										// Перерисовка
										repaint: function repaint() {
											var element = this.element,
											    password = this.password,
											    button = this.button;

											// Активация/деактивация
											password.toggleClass('disabled', element.is(':disabled'));

											// Активация/деактивация кнопки
											button.prop('disabled', element.is(':disabled'));

											return this;
										},

										// Уничтожение
										destroy: function destroy() {
											var element = this.element;

											element.off('.' + pluginName + ', refresh').closest('.jq-password').before(element).remove();

											return this;
										}
									};

									return Component;
								}();

								this.customElement = new Password(element, this.options.password, this.locales.password);
							}
							// Скрытое поле
							else if (element.is('input[type="hidden"]')) {
									return;
								}
								// Список
								else if (element.is('select')) {
										var SelectBox = function () {
											var Component = function Component(element, options, locale) {
												//
												this.element = element;
												this.options = options;
												this.locale = locale;

												//
												this.ajaxOptions = options.search.ajax;
												this.ajaxData = { term: '', page: 0 };
												this.ajaxTimeout = undefined;

												//
												var attr = new Attributes(this.element);

												// Поле поиска
												this.searchBlock = $('<div class="jq-selectbox__search">' + '<input type="search" autocomplete="off" placeholder="' + (element.data('search-placeholder') || locale.search['placeholder']) + '">' + '</div>' + '<div class="jq-selectbox__not-found">' + (element.data('search-not-found') || locale.search['notFound']) + '</div>').hide();

												// Выпадающий список
												this.dropdown = $('<div class="jq-selectbox__dropdown" style="position: absolute">' + '<ul></ul>' + '</div>').prepend(this.searchBlock);

												// Формируем компонент
												this.selectbox = $('<div class="jq-selectbox jqselect">' + '<div class="jq-selectbox__select">' + '<div class="jq-selectbox__select-text"></div>' + '<div class="jq-selectbox__trigger">' + (options.triggerHTML || '') + '</div>' + '</div></div>').attr({ 'id': attr.id, 'title': attr.title }).data(attr.data).addClass(attr.classes).append(this.dropdown);

												// Вставляем оригинальный элемент в псевдоблок
												element.after(this.selectbox).prependTo(this.selectbox);

												// Разбираем на составляющие 
												this.selectboxSelect = $('div.jq-selectbox__select', this.selectbox);
												this.selectboxText = $('div.jq-selectbox__select-text', this.selectbox);

												// Загрузка выпадающего списка
												this.loadDropdown();

												// Скрываем список
												this.dropdown.hide();

												//
												this.setEvents().repaint();

												// Прячем оригинальный селект
												element.addClass('jq-hidden');
											};

											Component.prototype = {
												// Загрузка выпадающего списка
												loadDropdown: function loadDropdown() {
													var element = this.element,
													    options = this.options,
													    locale = this.locale,
													    selectbox = this.selectbox,
													    dropdown = this.dropdown,
													    searchBlock = this.searchBlock;

													//
													var optionList = $('option', element),
													    optionSelected = optionList.filter(':selected'),
													    ulList = SelectBoxExtra.makeList(optionList),
													    searchEnabled = !element.data('search') || options.search,
													    searchLimit = element.data('search-limit') || (options.search || {}).limit,
													    notFound = $('div.jq-selectbox__not-found', dropdown);

													// Заменяем содержимое списка
													dropdown.find('ul').replaceWith(ulList);

													//
													var dropdownLi = $('li', dropdown).css({ 'display': 'inline-block' }),
													    liSelected = dropdownLi.filter('.selected');

													//
													if (dropdown.css('left') === 'auto') {
														dropdown.css({ left: 0 });
													}

													// Обновляем ширину
													this.calculateDropdownWidth();

													// Обновляем высоту
													this.calculateDropdownHeight();

													// Добавляем поле поиска
													if (searchEnabled && (dropdownLi.length > searchLimit || this.ajaxOptions !== undefined && this.ajaxOptions.url !== '')) {
														searchBlock.show();

														// "Не найдено"
														notFound.toggle(dropdownLi.filter(':visible').length < 1);
													} else {
														searchBlock.hide();
													}

													// Если выбран не дефолтный пункт
													if (liSelected.length) {
														// Добавляем класс, показывающий изменение селекта
														if (optionList.first().text() !== optionSelected.text()) {
															selectbox.addClass('changed');
														}

														// Передаем селекту класс выбранного пункта
														selectbox.data('jqfs-class', liSelected.data('jqfs-class')).addClass(liSelected.data('jqfs-class'));
													}

													return this;
												},

												// Закрыватие списка
												closeDropdown: function closeDropdown() {
													var element = this.element,
													    options = this.options,
													    selectbox = this.selectbox,
													    dropdown = this.dropdown;

													// Прячем список
													dropdown.hide();
													selectbox.removeClass('opened dropup dropdown');

													// Колбек при закрытии селекта
													options.onClosed.call(selectbox);

													return this;
												},

												//
												openDropdown: function openDropdown() {
													var element = this.element,
													    options = this.options,
													    selectbox = this.selectbox,
													    dropdown = this.dropdown,
													    dropdownSearch = this.searchBlock.find('input');

													//
													var notFound = $('div.jq-selectbox__not-found', dropdown);

													// 
													$('div.jqselect').removeClass('opened');

													//
													$('div.jq-selectbox__dropdown:visible').hide();

													// Добавляем классы
													selectbox.addClass('opened focused');

													// Отображаем список
													dropdown.show();

													//
													this.smartPosition();

													// Поисковое поле
													if (dropdownSearch.parent().is(':visible')) {
														// Сбрасываем значение и начинаем поиск
														dropdownSearch.trigger('focus');

														// Прячем блок "не найдено"
														notFound.hide();
													}

													// Колбек при открытии селекта
													options.onOpened.call(selectbox);

													return this;
												},

												// Расчёт ширины
												calculateDropdownWidth: function calculateDropdownWidth() {
													var element = this.element,
													    selectbox = this.selectbox,
													    selectboxText = this.selectboxText,
													    dropdown = this.dropdown;

													// Разбираем на составляющие выпадающий список
													var dropdownLi = $('li', dropdown);

													//
													var liWidthInner = 0,
													    liWidth = 0;

													// Расчитываем максимальную ширину
													dropdownLi.each(function () {
														var item = $(this);

														if (item.innerWidth() > liWidthInner) {
															liWidthInner = item.innerWidth();
															liWidth = item.width();
														}
													});

													// Убираем инлайновый стиль
													dropdownLi.css({ 'display': '' });

													// Подстраиваем ширину свернутого селекта в зависимости
													// от ширины плейсхолдера или самого широкого пункта
													if (selectboxText.is('.placeholder') && selectboxText.width() > liWidthInner) {
														selectbox.width(selectboxText.width());
													} else {
														// Клонируем селектор и устанавливаем ему размер "авто"
														var selClone = selectbox.clone().appendTo('body').width('auto');

														// Записываем размер клона
														var selCloneWidth = selClone.outerWidth();

														// Удаляем клон
														selClone.remove();

														// 
														if (selCloneWidth === selectbox.outerWidth()) {
															selectbox.width(liWidth);
														}
													}

													// Подстраиваем ширину выпадающего списка в зависимости от самого широкого пункта
													if (liWidthInner > selectbox.width()) {
														dropdown.width(liWidthInner);
													}

													// Прячем 1-ю пустую опцию, если она есть и если атрибут data-placeholder не пустой
													// если все же нужно, чтобы первая пустая опция отображалась, то указываем у селекта: data-placeholder=""
													if ($('option', element).first().text() === '' && element.data('placeholder') !== '') {
														dropdownLi.first().hide();
													}

													return this;
												},

												// Расчёт высоты
												calculateDropdownHeight: function calculateDropdownHeight() {
													var element = this.element,
													    options = this.options,
													    selectbox = this.selectbox,
													    dropdown = this.dropdown;

													//
													var dropdownLi = $('li', dropdown);

													//
													if (dropdownLi.data('li-height') === undefined) {
														dropdownLi.data('li-height', dropdownLi.outerHeight());
													}

													//
													if (dropdown.css('top') === 'auto') {
														dropdown.css({ top: selectbox.outerHeight(true) || 0 });
													}

													return this;
												},

												// Умное позиционирование
												smartPosition: function smartPosition() {
													var element = this.element,
													    options = this.options,
													    ajaxOptions = this.ajaxOptions,
													    selectbox = this.selectbox,
													    dropdown = this.dropdown,
													    dropdownSearch = this.searchBlock.find('input');

													//
													var selectSmartPosition = element.data('smart-position') || options.smartPosition;

													// Разбираем на составляющие выпадающий список
													var dropdownUl = $('ul', dropdown),
													    dropdownLi = $('li', dropdown),
													    notFound = $('div.jq-selectbox__not-found', dropdown),
													    itemCount = dropdownLi.length,
													    selectHeight = selectbox.outerHeight(true) || 0,
													    maxHeight = dropdownUl.css('max-height') || 0,
													    position = selectHeight || 0;

													// Умное позиционирование - переменные
													var liHeight = dropdownLi.data('li-height') || 0;

													// Умное позиционирование - константы
													var visible = element.data('visible-options') || options.visibleOptions,
													    topOffset = selectbox.offset().top || 0,
													    bottomOffset = $(window).height() - selectHeight - (topOffset - $(window).scrollTop()),
													    searchHeight = dropdownSearch.parent().outerHeight(true) || 0,
													    newHeight = visible === 0 ? 'auto' : liHeight * visible,
													    minHeight = visible > 0 && visible < 6 ? newHeight : liHeight * (itemCount < 5 ? itemCount : 5);

													// Раскрытие вверх
													if (selectSmartPosition && bottomOffset <= minHeight + searchHeight + liHeight) {
														this.dropUp(dropdownUl, topOffset, newHeight, liHeight, maxHeight);
													}
													// Раскрытие вниз
													else {
															this.dropDown(dropdownUl, bottomOffset, newHeight, liHeight, maxHeight);
														}

													// Если выпадающий список выходит за правый край окна браузера,
													// то меняем позиционирование с левого на правое
													if (selectbox.offset().left + dropdown.outerWidth() > $(window).width()) {
														dropdown.css({ left: 'auto', right: 0 });
													}

													// Минимальная высота списка
													if ( /*itemCount <= 0 &&*/dropdownUl.outerHeight(true) < minHeight) {
														dropdownUl.css('min-height', minHeight);
													}

													// Прокручиваем до выбранного пункта при открытии списка
													if (dropdownLi.filter('.selected').length) {
														if (element.val() === '') {
															dropdownUl.scrollTop(0);
														} else {
															// Если нечетное количество видимых пунктов,
															// то высоту пункта делим пополам для последующего расчета
															if (dropdownUl.innerHeight() / liHeight % 2 !== 0) {
																liHeight = liHeight / 2;
															}

															//
															dropdownUl.scrollTop(dropdownUl.scrollTop() + dropdownLi.filter('.selected').position().top - dropdownUl.innerHeight() / 2 + liHeight);
														}
													}

													//
													SelectBoxExtra.preventScrolling(dropdownUl);

													return this;
												},

												// Выпадающее вниз меню
												// @todo: Как-то тут много "магии"
												dropDown: function dropDown(menu, offset, newHeight, liHeight, maxHeight) {
													var searchHeight = $('input', this.dropdown).parent().outerHeight(true) || 0;

													//
													this.selectbox.removeClass('dropup').addClass('dropdown');

													//
													var maxHeightBottom = function maxHeightBottom() {
														menu.css('max-height', Math.floor((offset - searchHeight - liHeight) / liHeight) * liHeight);
													};

													// Сначала высчитываем максимальную высоту
													maxHeightBottom();

													// Если есть конкретная высота - выставляем её
													menu.css('max-height', maxHeight !== 'none' && parseInt(maxHeight) > 0 ? parseInt(maxHeight) : newHeight);

													// Если высота больше чем нужно - снова ставим максммальную
													if (offset < this.dropdown.outerHeight() + liHeight) {
														maxHeightBottom();
													}

													return this;
												},

												// Выпадающее вверх меню
												// @todo: Как-то тут много "магии"
												dropUp: function dropUp(menu, offset, newHeight, liHeight, maxHeight) {
													var searchHeight = $('input', this.dropdown).parent().outerHeight(true) || 0;

													//
													this.selectbox.removeClass('dropdown').addClass('dropup');

													//
													var maxHeightTop = function maxHeightTop() {
														menu.css('max-height', Math.floor((offset - $(window).scrollTop() - searchHeight - liHeight) / liHeight) * liHeight);
													};

													// Сначала высчитываем максимальную высоту
													maxHeightTop();

													// Если есть конкретная высота - выставляем её
													menu.css('max-height', maxHeight !== 'none' && maxHeight > 0 ? maxHeight : newHeight);

													// Если высота больше чем нужно - снова ставим максммальную
													if (offset - $(window).scrollTop() - liHeight < this.dropdown.outerHeight() + liHeight) {
														maxHeightTop();
													}

													//
													this.dropdown.css({ top: 'auto' });

													return this;
												},

												// Обработка событий
												setEvents: function setEvents() {
													var context = this,
													    element = this.element,
													    options = this.options,
													    ajaxOptions = this.ajaxOptions,
													    selectbox = this.selectbox,
													    dropdown = this.dropdown,
													    dropdownSearch = this.searchBlock.find('input'),
													    selectboxSelect = this.selectboxSelect;

													// Разбираем на составляющие выпадающий список
													var dropdownUl = $('ul', dropdown),
													    dropdownLi = $('li', dropdown),
													    notFound = $('div.jq-selectbox__not-found', dropdown);

													// Необходимо "перерисовать" контрол
													selectbox.on('repaint', function () {
														context.repaint();
													})
													// Необходимо закрыть выпадающий список
													.on('dropdown:close', function () {
														context.closeDropdown();
													})
													// Необходимо открыть выпадающий список
													.on('dropdown:open', function () {
														context.openDropdown();
													});

													// Клик по псевдоблоку
													selectboxSelect.on('click', function (event) {
														// Клик должен срабатывать только при активном контроле
														if (element.is(':disabled')) {
															return;
														}

														// Колбек при закрытии селекта
														if ($('div.jq-selectbox').filter('.opened').length) {
															options.onClosed.call($('div.jq-selectbox').filter('.opened'));
														}

														// Фокусируем
														element.trigger('focus');

														// Если iOS, то не показываем выпадающий список,
														// т.к. отображается нативный и неизвестно, как его спрятать
														if (iOS) {
															return;
														}

														// Выпадающий список скрыт
														if (dropdown.is(':visible')) {
															selectbox.triggerHandler('dropdown:close');
														} else {
															selectbox.triggerHandler('dropdown:open');
														}
													});

													// Начинаем поиск после "отжатия кнопки"
													dropdownSearch.on('keyup', function () {
														var query = $(this).val(),
														    optionList = $('option', context.element);

														// 
														if (ajaxOptions !== undefined && ajaxOptions.url !== '') {
															if (query !== '') {
																if (context.ajaxTimeout) {
																	window.clearTimeout(context.ajaxTimeout);
																}
																context.ajaxTimeout = window.setTimeout(function () {
																	context.ajaxSearch(query, true);
																}, ajaxOptions.delay || 100);
															} else {
																// Очищаем список
																element.find('option').remove();

																// Перезагружаем список
																context.loadDropdown();
															}
														} else {
															// Проходим по содержимому
															dropdownLi.each(function () {
																var find = $(this).html().match(new RegExp('.*?' + query + '.*?', 'i'));

																//
																$(this).toggle(find ? true : false);
															});
														}

														// Прячем 1-ю пустую опцию
														if (optionList.first().text() === '' && element.data('placeholder') !== '') {
															dropdownLi.first().hide();
														}

														// Видимость блока "не найдено"
														notFound.toggle(dropdownLi.filter(':visible').length < 1);
													});

													//
													dropdown.on('mouseout', function () {
														$('li.sel', this).addClass('selected');
													})
													// При наведении курсора на пункт списка
													.on('hover', 'li', function () {
														$(this).siblings().removeClass('selected');
													})
													// При клике на пункт визуального списка
													.on('click', 'li', function () {
														var selected = $(this),
														    optionList = $('option', context.element);

														// Если пункт не активен или заголовок - не пускаем дальше
														if (selected.is('.disabled, .optgroup')) {
															return;
														}

														//
														if (!selected.is('.selected')) {
															var index = selected.index() - selected.prevAll('.optgroup').length;

															//
															optionList.prop('selected', false).eq(index).prop('selected', true);

															//
															element.change();
														}

														// Прячем список
														selectbox.triggerHandler('dropdown:close');
													});

													// Реакция на смену пункта оригинального селекта
													element.on('change.' + pluginName, function () {
														selectbox.triggerHandler('repaint');
													})
													// Фокусировка
													.on('focus.' + pluginName, function () {
														selectbox.addClass('focused');
													})
													// Расфокусировка
													.on('blur.' + pluginName, function (event) {
														selectbox.removeClass('focused');
													})
													// Изменение селекта с клавиатуры
													.on('keydown.' + pluginName + ' keyup.' + pluginName, function (event) {
														//
														var liHeight = dropdownLi.data('li-height');

														// Вверх, влево, Page Up, Home
														if (event.which === 38 || event.which === 37 || event.which === 33 || event.which === 36) {
															if (element.val() === '') {
																dropdownUl.scrollTop(0);
															} else {
																dropdownUl.scrollTop(dropdownUl.scrollTop() + dropdownLi.filter('.selected').position().top);
															}
														}
														// Вниз, вправо, Page Down, End
														if (event.which === 40 || event.which === 39 || event.which === 34 || event.which === 35) {
															dropdownUl.scrollTop(dropdownUl.scrollTop() + dropdownLi.filter('.selected').position().top - dropdownUl.innerHeight() + liHeight);
														}

														// Закрываем выпадающий список при нажатии Enter
														if (event.which === 13) {
															event.preventDefault();

															// Прячем список
															selectbox.triggerHandler('dropdown:close');
														}
													}).on('keydown.' + pluginName, function (event) {
														if (event.which === 32) {
															//
															selectboxSelect.triggerHandler('click');

															return false;
														}
													});

													return this;
												},

												// Поиск на сервере
												ajaxSearch: function ajaxSearch(term, clear) {
													var context = this,
													    element = this.element,
													    options = this.options,
													    ajaxOptions = this.ajaxOptions;

													// Добавляем в данные поисковый запрос
													this.ajaxData.term = term;

													// Параметры по умолчанию
													var ajaxDefault = {
														type: 'GET',

														success: function success(data, textStatus, jqXHR) {
															return context.ajaxSearchSuccess(data, clear);
														},
														error: function error(data, textStatus, jqXHR) {
															// Очищаем при необходимости
															if (clear) {
																element.find('option').remove();
																context.loadDropdown();
															}

															if (context.options.debug && window.console && console.error) {
																console.error('JQuery.FormStyler-Modern: Ошибка при запросе!');
															}
														}
													};

													// Объеденяем настройки
													var requestOptions = $.extend(ajaxDefault, ajaxOptions);

													// Вызываем функцию
													if (typeof requestOptions.url === 'function') {
														requestOptions.url = ajaxOptions.url.call(element, context.ajaxData);
													}

													// Вызываем функцию
													if (typeof requestOptions.data === 'function') {
														requestOptions.data = ajaxOptions.data.call(element, context.ajaxData);
													}

													// Отправляем запрос
													$.ajax(requestOptions);

													return this;
												},

												// Обработка удачного ответа
												ajaxSearchSuccess: function ajaxSearchSuccess(data, clear) {
													var context = this,
													    element = this.element,
													    options = this.options,
													    ajaxOptions = this.ajaxOptions;

													// Обрабатываем результат
													var results = ajaxOptions.processResults(data, context.ajaxData);

													// Проверка массива с результатом
													if (this.options.debug && window.console && console.error) {
														if (!results || !results.items || !$.isArray(results.items)) {
															console.error('JQuery.FormStyler-Modern: В ответе не найдены данные по ключу - `items`.');
														}
													}

													// Очищаем при необходимости
													if (clear) {
														element.find('option').remove();
													}

													// Считываем список элементов
													var items = results.items || results;

													// Выводим список
													$(items).each(function (index, item) {
														$('<option>').val(item.value || item.id || index).text(item.caption || item.name || item.text || item).appendTo(element);
													});

													// Обновляем выпадающий список
													this.loadDropdown();

													//
													this.smartPosition();

													return this;
												},

												// Перерисовка
												repaint: function repaint() {
													var element = this.element,
													    options = this.options,
													    selectbox = this.selectbox,
													    dropdown = this.dropdown,
													    selectboxText = this.selectboxText;

													//
													var optionList = $('option', element),
													    li = $('li', dropdown);

													//
													var selectedItems = optionList.filter(':selected');

													// Выводим в тексте выбранный элемент
													if (selectedItems.val() === undefined || selectedItems.val() === '') {
														selectboxText.html(element.data('placeholder') || options.placeholder).addClass('placeholder');
													} else {
														selectboxText.html(selectedItems.html()).removeClass('placeholder');
													}

													// Удаляем ранее установленный "спец. класс"
													if (selectbox.data('jqfs-class')) {
														selectbox.removeClass(selectbox.data('jqfs-class'));
													}

													// Передаем селекту класс выбранного пункта
													selectbox.data('jqfs-class', selectedItems.attr('class')).addClass(selectedItems.attr('class'));

													// Ставим класс отметки
													li.removeClass('selected sel').not('.optgroup').eq(element[0].selectedIndex).addClass('selected sel');

													// Отметка деактивации на пунктах
													li.removeClass('disabled').not('.optgroup').filter(function (index) {
														return optionList.eq(index).is(':disabled');
													}).addClass('disabled');

													// Добавляем класс, показывающий изменение селекта
													selectbox.toggleClass('changed', optionList.first().text() !== li.filter('.selected').text());

													// Активация/деактивация
													selectbox.toggleClass('disabled', element.is(':disabled'));

													return this;
												},

												// Уничтожение
												destroy: function destroy() {
													this.element.off('.' + pluginName).removeAttr('style').parent().before(this.element).remove();

													return this;
												}
											};

											return Component;
										}();
										var SelectBoxMulti = function () {
											var Component = function Component(element, options, locale) {
												//
												this.element = element;
												this.options = options;
												this.locale = locale;

												//
												var attr = new Attributes(this.element);

												//
												this.selectbox = $('<div class="jq-select-multiple jqselect"></div>').attr({ 'id': attr.id, 'title': attr.title }).addClass(attr.classes).data(attr.data);

												// Вставляем оригинальный элемент в псевдоблок
												element.after(this.selectbox).prependTo(this.selectbox);

												//
												this.loadList();

												//
												var ul = $('ul', this.selectbox),
												    li = $('li', this.selectbox).attr('unselectable', 'on'),
												    size = this.element.attr('size') || 4,
												    ulHeight = ul.outerHeight() || 0,
												    liHeight = li.outerHeight() || 0;

												//
												ul.css({ 'height': liHeight * size });

												// 
												if (ulHeight > this.selectbox.height()) {
													ul.css('overflowY', 'scroll');
													SelectBoxExtra.preventScrolling(ul);

													// Прокручиваем до выбранного пункта
													if (li.filter('.selected').length) {
														ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top);
													}
												}

												// Прячем оригинальный селект
												this.element.addClass('jq-hidden');

												//
												this.setEvents().repaint();
											};

											Component.prototype = {
												// Загрузка списка
												loadList: function loadList() {
													var element = this.element,
													    selectbox = this.selectbox;

													var optionList = $('option', element),
													    ulList = SelectBoxExtra.makeList(optionList);

													// Обновляем содержимое
													selectbox.remove('ul').append(ulList);

													//
													return this;
												},

												// Обработка событий
												setEvents: function setEvents() {
													var context = this,
													    element = this.element,
													    selectbox = this.selectbox;

													var optionList = $('option', element),
													    ul = $('ul', selectbox),
													    li = $('li', selectbox),
													    ulHeight = ul.outerHeight() || 0,
													    liHeight = li.outerHeight() || 0,
													    mobile = Android || iOS;

													// Необходимо "перерисовать" контрол
													selectbox.on('repaint', function () {
														context.repaint();
													});

													// При клике на пункт списка
													li.on('click tap', function (e) {
														var selected = $(this);

														// Клик должен срабатывать только при активном контроле
														if (element.is(':disabled') || selected.is('.disabled')) {
															return;
														}

														// Фокусируем
														element.focus();

														// Удаление лишних классов
														if (mobile && !element.is('[multiple]') || !mobile && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
															selected.siblings().removeClass('selected first');
														}

														// Добавление класса отметки
														if (mobile && !element.is('[multiple]') || !mobile && !e.ctrlKey && !e.metaKey) {
															selected.addClass('selected');
														}

														// Если это заголовок группы
														if (element.is('[multiple]') && selected.is('.optgroup')) {
															// 
															var selectedGroup = selected.nextUntil('.optgroup');

															//
															selectedGroup.each(function () {
																if (!$(this).is('.disabled, .optgroup')) {
																	if ($(this).is('.first')) {
																		$(this).removeClass('first');
																	}

																	$(this).toggleClass('selected');
																}
															});
														}
														// Выделение нескольких пунктов
														else if (element.is('[multiple]')) {
																// Отмечаем классом - первый элемент
																if (!e.shiftKey) {
																	selected.addClass('first');
																}

																// Выделение пунктов при зажатом Ctrl
																if (mobile || e.ctrlKey || e.metaKey) {
																	selected.toggleClass('selected first', !selected.is('.selected')).siblings().removeClass('first');
																}
																// Выделение пунктов при зажатом Shift
																else if (e.shiftKey) {
																		// Функция отметки
																		var selectedFunc = function selectedFunc() {
																			if ($(this).is('.selected')) {
																				return false;
																			} else {
																				$(this).not('.disabled, .optgroup').addClass('selected');
																			}
																		};

																		//
																		selected.siblings().removeClass('selected').siblings('.first').addClass('selected');

																		// Предыдущие пункты
																		if (selected.prevAll('.first').length > 0) {
																			selected.prevAll().each(selectedFunc);
																		}

																		// Следующие пункты
																		if (selected.nextAll('.first').length > 0) {
																			selected.nextAll().each(selectedFunc);
																		}

																		//
																		if (li.filter('.selected').length === 1) {
																			selected.addClass('first');
																		}
																	}
															}

														// Отмечаем выбранные мышью
														optionList.prop('selected', false);

														//
														li.filter('.selected').each(function () {
															var item = $(this),
															    index = item.index() - (item.is('.option') ? item.prevAll('.optgroup').length : 0);

															optionList.eq(index).prop('selected', true);
														});

														//
														element.change();
													});

													// Отмечаем выбранные с клавиатуры
													optionList.each(function (i) {
														$(this).data('optionIndex', i);
													});

													// Реакция на смену пункта оригинального селекта
													element.on('change.' + pluginName, function () {
														selectbox.triggerHandler('repaint');
													})
													// Фокусировка
													.on('focus.' + pluginName, function () {
														selectbox.addClass('focused');
													})
													// Расфокусировка
													.on('blur.' + pluginName, function () {
														selectbox.removeClass('focused');
													});

													// Прокручиваем с клавиатуры
													if (ulHeight > selectbox.height()) {
														element.on('keydown.' + pluginName, function (e) {
															// вверх, влево, PageUp
															if (e.which === 38 || e.which === 37 || e.which === 33) {
																ul.scrollTop(ul.scrollTop() + li.filter('.selected').position().top - liHeight);
															}
															// вниз, вправо, PageDown
															if (e.which === 40 || e.which === 39 || e.which === 34) {
																ul.scrollTop(ul.scrollTop() + li.filter('.selected:last').position().top - ul.innerHeight() + liHeight * 2);
															}
														});
													}

													return this;
												},

												// Перерисовка
												repaint: function repaint() {
													var element = this.element,
													    selectbox = this.selectbox;

													var optionList = $('option', element),
													    li = $('li', selectbox);

													//
													var arrIndexes = [];
													optionList.filter(':selected').each(function () {
														arrIndexes.push($(this).data('optionIndex'));
													});

													//
													li.removeClass('selected').not('.optgroup').filter(function (i) {
														return $.inArray(i, arrIndexes) > -1;
													}).addClass('selected');

													// Отметка деактивации на пунктах
													li.removeClass('disabled').not('.optgroup').filter(function (index) {
														return optionList.eq(index).is(':disabled');
													}).addClass('disabled');

													// Активация/деактивация
													selectbox.toggleClass('disabled', element.is(':disabled'));

													return this;
												},

												// Уничтожение
												destroy: function destroy() {
													this.element.off('.' + pluginName + ', refresh').removeAttr('style').parent().before(this.element).remove();

													return this;
												}
											};

											return Component;
										}();

										// Стилизируем компонент
										if (element.is('[multiple]') || element.attr('size') > 1) {
											this.customElement = new SelectBoxMulti(element, this.options.select, this.locales.select);
										} else {
											this.customElement = new SelectBox(element, this.options.select, this.locales.select);

											// Инициализация спец.обработчиков
											if (!SelectBoxExtra.initEvent) {
												SelectBoxExtra.init();
											}
										}
									}
									// Другие компоненты
									else if (element.is('input') || element.is('textarea') || element.is('button') || element.is('a.button')) {
											// Добавляем класс
											element.addClass(pluginName);

											// Обработка кнопки сброса для стилизованных елементов
											if (element.is('input[type="reset"]')) {
												element.on('click', function () {
													element.closest('form').children().trigger('repaint');
												});
											}

											// Хак для input[type="range"] в IE
											// @todo: Найти лучшее решение
											if (element.is('input[type="range"]') && IE) {
												var cssDisplay = element.css('display');

												element.css('display', 'block');
												setTimeout(function () {
													element.css('display', cssDisplay);
												}, 1);
											}
										}

			// Переинициализация
			element.on('refresh reinitialize', function () {
				context.reinitialize();
			});
		},

		// Убрать стилизацию елемент(а/ов) 
		destroy: function destroy(reinitialize) {
			var el = $(this.element);

			// Если происходит уничтожение для переинициализации - data удалять не нужно
			if (!reinitialize) {
				el.removeData('_' + pluginName);
			}

			// Убираем "невидимость" елемента
			el.removeClass('jq-hidden');

			// Дополнительная пост-обработка checkbox и radio
			if (this.customElement !== undefined) {
				this.customElement.destroy();
			}
		},

		// Переинициализация стилизованного элемента - с изменёнными параметрами
		reinitialize: function reinitialize(options) {
			// Убираем стилизацию елементов
			this.destroy(true);

			// Перезаписываем настройки
			this.options = $.extend(true, {}, this.options, options);

			// Расширяем текущий словарь словами переданными через настройки
			this.locales = $.extend(true, {}, this.locales, this.options.locales);

			// Снова инициализируем стилизацию
			this.init();
		}
	};

	// Прописываем плагин в JQuery
	$.fn[pluginName] = function (options) {
		var args = arguments;

		// Если параметры это объект
		if (options === undefined || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
			// Проходим по компоненам
			this.each(function () {
				if (!$.data(this, '_' + pluginName)) {
					$.data(this, '_' + pluginName, new Plugin(this, options));
				}
			})
			// Ожидаем полного прохода
			.promise()
			// Колбек после выполнения плагина
			.done(function () {
				var opt = $(this[0]).data('_' + pluginName);

				if (opt) {
					opt.options.onFormStyled.call();
				}
			});

			return this;
		}
		// Если параметры это строка
		else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
				var returns = undefined;

				//
				this.each(function () {
					var instance = $.data(this, '_' + pluginName);

					if (instance instanceof Plugin && typeof instance[options] === 'function') {
						returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					}
				});

				return returns !== undefined ? returns : this;
			}
	};

	var SelectBoxExtra = function () {
		return {
			initEvent: false,

			// Инициализация спец. обработчиков
			init: function init() {
				this.initEvent = true;

				// Прячем выпадающий список при клике за пределами селекта
				$(document).on('click', function (event) {
					// e.target.nodeName != 'OPTION' - добавлено для обхода бага в Opera на движке Presto
					// (при изменении селекта с клавиатуры срабатывает событие onclick)
					if (!$(event.target).parents().hasClass('jq-selectbox') && event.target.nodeName !== 'OPTION' && $('.jq-selectbox.opened').length) {
						$('.jq-selectbox.opened').triggerHandler('dropdown:close');
					}
				});

				// Скрытие выпадающего списка при фокусе на стороннем элементе
				$(document).on('focus', 'select, input, textarea, button, a', function (event) {
					var focusedSelect = $('.jq-selectbox.opened'),
					    currentSelect = $(event.currentTarget).parents('.jq-selectbox');

					if (focusedSelect.get(0) === currentSelect.get(0)) {
						return;
					}

					// Скрываем выпадающий список
					focusedSelect.triggerHandler('dropdown:close');
				});
			},

			// Запрещаем прокрутку страницы при прокрутке селекта
			preventScrolling: function preventScrolling(selector) {
				var scrollDiff = selector.prop('scrollHeight') - selector.outerHeight();

				//
				var wheelDelta = null,
				    scrollTop = null;

				// 
				selector.off('mousewheel DOMMouseScroll').on('mousewheel DOMMouseScroll', function (e) {
					wheelDelta = e.originalEvent.detail < 0 || e.originalEvent.wheelDelta > 0 ? 1 : -1; // Направление прокрутки (-1 вниз, 1 вверх)
					scrollTop = selector.scrollTop(); // Позиция скролла

					if (scrollTop >= scrollDiff && wheelDelta < 0 || scrollTop <= 0 && wheelDelta > 0) {
						e.stopPropagation();
						e.preventDefault();
					}
				});

				return this;
			},

			// Формируем список селекта
			makeList: function makeList(opList) {
				var list = $('<ul>');

				// Перебираем список элементов
				for (var i = 0; i < opList.length; i++) {
					var op = opList.eq(i),
					    id = (op.attr('id') || '') !== '' ? op.attr('id') + idSuffix : '',
					    title = op.attr('title');

					var liClass = op.attr('class') || '';

					if (op.is(':selected')) {
						liClass += (liClass !== '' ? ' ' : '') + 'selected sel';
					}

					if (op.is(':disabled')) {
						liClass += (liClass !== '' ? ' ' : '') + 'disabled';
					}

					// Параметры по умолчанию
					var defaultAttr = { 'title': title,
						'data': op.data(),
						'html': op.html() };

					// Добавляем к пункту идентификатор если он есть
					if (id !== '') {
						defaultAttr['id'] = id;
					}

					// Если есть optgroup
					if (op.parent().is('optgroup')) {
						var optGroupClass = '';

						//
						if (op.parent().attr('class') !== undefined) {
							optGroupClass = ' ' + op.parent().attr('class');
						}

						// Заголовок группы
						if (op.is(':first-child')) {
							$('<li>', { 'class': 'optgroup' + optGroupClass,
								'html': op.parent().attr('label') }).appendTo(list);
						}

						// Создаём пункт для группы
						$('<li>', $.extend(defaultAttr, { 'class': 'option' })).addClass(liClass).addClass(optGroupClass).data('jqfs-class', op.attr('class')).appendTo(list);
					} else {
						// Создаём пункт
						$('<li>', defaultAttr).addClass(liClass).data('jqfs-class', op.attr('class')).appendTo(list);
					}
				}

				return list;
			}
		};
	}();
	// Определяем общего родителя у радиокнопок с одинаковым name
	// http://stackoverflow.com/a/27733847
	$.fn.commonParents = function () {
		var cachedThis = this;

		return cachedThis.first().parents().filter(function () {
			return $(this).find(cachedThis).length === cachedThis.length;
		});
	};

	$.fn.commonParent = function () {
		return $(this).commonParents().first();
	};
});