export default class Container {
	#el;

	constructor(name, params) {
		this.name = name;
		params = Object.assign({}, params);
		this.cls = params.cls || ('widget-' + name);
		this.title = params.title;
		if (params.click)
			this.click = params.click;
	}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class="widget ' + this.cls + '">'
			+ '<div class="widget-wrap">'
			+ '<div class="widget-title">' + (this.title || '') + '</div>'
			+ '<div class="widget-body"></div>'
			+ '</div>'
			+ '</div>';
		const el = $(html);

		if (!this.title)
			el.find('div.widget-title').hide();

		el.find('>div.widget-wrap').click((e) => {
			e.stopPropagation();
			this.click();
		});

		this.#el = el;

		this.init(el, el.find('div.widget-body'));

		return el;
	}

	get body() { return this.el.find('div.widget-body'); }

	isRendered() { return !!this.#el; }

	//get title() { return this.el.find('>div.widget-title'); }

	click() {}

	init() {}

	setTitle(title) {
		if (title)
			this.el.find('div.widget-title').html(title).show();
		else
			this.el.find('div.widget-title').html('').hide();
	}

	show() { this.el.show(); }

	hide() { this.el.hide(); }

	append(element) { this.body.append(element.el); }

	destroy() {
		if (this.isRendered())
			this.#el.remove();
	}
}
