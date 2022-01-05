export default class Group {
	#el;

	constructor(params) {
		Object.assign(this, params);
	}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class="widgets-group ' + (this.cls || '') + '">'
			+ '<div class="group-title">' + (this.title || '') + '</div>'
			+ '<div class="group-body"></div>'
			+ '</div>';
		const el = $(html);
		const body = el.find('>div.group-body');

		if (!this.title)
			el.find('>div.group-title').hide();

		this.widgets.forEach(w => body.append(w.el));

		if (0 === this.widgets.length)
			el.hide();

		this.#el = el;

		this.init(el, body);

		if (this.slider)
			body.touchSlider({item: 'div.widget'});

		return el;
	}

	get body() { return el.find('>div.group-body'); }

	init() {}

	show() { this.el.show(); }

	hide() { this.el.hide(); }

	destroy() {
		this.widgets.forEach(w => w.destroy());
		this.#el.remove();
		this.#el = null;
	}
}
