import {EventsTrait} from "../../core";
import Button from "../Button"

const Bounds = 8;
const defaultOptions = {
	title: '',
	html: '',
	cls: '',
	closeAction: 'remove',
	processHtml: true,
	processForm: true,
	modal: true,
	autoclose: true,
	closable: true,
	draggable: false,
	buttons: []
};
const defaultButtons = {
	cancel: {text: 'Отмена', cls: 'btn btn-cancel', handler: 'close'},
	close: {text: 'Закрыть', cls: 'btn btn-cancel', handler: 'close'},
	submit: {text: 'Сохранить', cls: 'btn btn-submit', handler: 'submit'},
	ok: {text: 'ОК', cls: 'btn btn-submit', handler: 'close'}
};
const defaultHandlers = {
	ok: function () { this.close(); },
	close: function () { this.close(); },
	cancel: function () { this.close(); },
	submit: function () { this.el.find('form').submit(); }
};
let $ID = 0;
let current = null;

function processHtml(win, body) {
	body.find('a').click(function (e) {
		const url = $(this).data('url');
		if (!url)
			return;

		e.preventDefault();
		win.load(url);
	});/**/

	body.find('button,a').click(function (e) {
		let action = $(this).data('action');
		if (!action || !defaultHandlers[action])
			return;
		e.preventDefault();
		defaultHandlers[action].call(win);
	});

	const firstEl = $(body[0].firstChild);
	if (firstEl.data('title'))
		win.setTitle(firstEl.data('title'));
	if (firstEl.data('cls'))
		win.setOption('cls', firstEl.data('cls'));

	const form = body.find('form');
	if (form.length && win.get('processForm')) {
		form.submit(function (e) {
			e.preventDefault();
			if (false === win.trigger('beforeSubmit', form))
				return;
			win.setLoading(true);
			const data = new FormData(this);
			const url = win.get('url');
			Http.ajax({
				url: form.attr('action') || (is_string(url) ? url : url.url),
				method: 'post',
				data: data,
				cache: false,
				//dataType: 'json',
				contentType: false,
				processData: false,
				success: function (r) {
					if (typeof (r) === 'string')
						win.setHtml(r);
					win.setLoading(false);
					win.trigger('submit', r);
				}
			});
		});

		if (win.get('autofocus'))
			form.find('input[type!="hidden"],textarea').eq(0).focus();
	}
}

function buttonsRenderer(win, buttons, buttonsEl) {
	let button;
	const l = buttons.length;
	for (let i = 0; i < l; i++) {
		button = buttons[i];
		if (typeof button === 'string')
			button = defaultButtons[button];

		if (typeof button.handler === 'string') {
			if (defaultHandlers[button.handler])
				button.handler = defaultHandlers[button.handler];
			else
				button.handler = window[button.handler];
		}

		button.scope = win;
		if (!(button instanceof Button))
			button = new Button(button);

		button.render(buttonsEl);
	}
}

class Window {
	#el;
	#options;
	static #shadow;

	constructor(options) {
		this.#options = Object.assign({}, defaultOptions, options);

		this.bindOptions(options, ['load', 'submit', 'content', 'open', 'close']);
	}

	get el() {
		if (this.#el)
			return this.#el;

		const opts = this.#options;
		const el = $('<div class="window ' + (opts.cls || '') + '"></div>');
		const self = this;

		el
			.append('<div class="btn-close" title="Закрыть"></div>')
			.append('<div class="window-title">' + (opts.title || '') + '</div>')
			.append('<div class="window-body">' + (opts.html || '') + '</div>')
		//.append('')
		;

		if (opts.buttons && opts.buttons.length) {
			const b = $('<div class="window-buttons"></div>').appendTo(el);
			buttonsRenderer(this, opts.buttons, b);
		}

		el.find('div.btn-close').click(function () { self.close(); });

		this.#el = el.appendTo(Window.shadow());

		if (this.get('url'))
			this.load();

		return el;
	}

	get(name) { return this.#options[name]; }

	getForm() { return this.el.find('form'); }

	set(name, value) { this.#options[name] = value; }

	setTitle(text) { this.#el.find('>div.window-title').html(text); };

	setHtml(text) {
		const body = this.#el.find('>div.window-body').html(text);

		if (this.get('processHtml'))
			processHtml(this, body);

		this.trigger('content');
	};

	setOption(name, value) {
		switch (name) {
			case 'cls':
				this.#el.attr('class', 'window ' + value);
				break;
			case 'title':
				this.setTitle(value);
				break;
			case 'url':
				this.load(value);
				break;
			case 'html':
				this.setHtml(value);
				break;
			case 'loading':
				this.setLoading(true);
				break;
			case 'modal':
				Window.shadow(true);
				break;
			//case 'renderTo':$el.appendTo(value);break;
			case 'draggable':
				if (value)
					this.#el.draggable({
						handle: 'div.window-title',
						opacity: 0.8,
						//grid: [5, 5],
						containment: this.#el.parent(),
						scroll: false,
						stop: function (e, ui) {
							options.left = ui.position.left;
							options.top = ui.position.top;
						}
					});
				break;
		}
	}

	setLoading(flag) {
		if (this.#el)
			this.#el[flag ? 'addClass' : 'removeClass']('loading');
	}

	load(url = null) {
		const self = this;
		this.setLoading(true);

		url = url || this.get('url');
		if (is_string(url))
			url = {url: url};
		url.success = function (html) {
			self.setHtml(html);
			self.setLoading(false);
			self.trigger('load');
		};
		url.error = function () {
			self.setHtml('Loading failed');
			self.setLoading(false);
		};
		Http.ajax(url);
	}

	submit() { this.#el.find('form').submit(); }

	hide() {
		this.#el.hide();

		if (current && current === this)
			current = null;

		Window.shadow(false);

		this.trigger('hide');
	}

	close(fireEvent) {
		if (this.#el) {
			this.setLoading(false);
			const a = this.get('closeAction');
			this.#el[a]();
			if (a === 'remove')
				this.#el = null;
		}

		//$(window).unbind('resize', onresize);
		//$(document).unbind('click', ondocumentclick);
		if (current && current === this)
			current = null;

		Window.shadow(false);

		if (false !== fireEvent)
			this.trigger('close');
	}

	show() {
		if (current && current !== this)
			current.close();
		current = this;
		this.el.show();
		Window.shadow(true);
	}

	destroy() {
		this.unbind();
	}

	static current() { return current; }

	static shadow(flag) {
		if (!Window.#shadow)
			Window.#shadow = $('<div class="shadow"></div>')
				.appendTo(document.body);

		if (undefined === flag)
			return Window.#shadow;

		Window.#shadow[flag ? 'show' : 'hide']();

		return Window.#shadow;
	}
}

Object.assign(Window.prototype, EventsTrait);

export default Window;
