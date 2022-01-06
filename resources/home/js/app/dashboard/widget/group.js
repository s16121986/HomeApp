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

		if (this.widgets && this.widgets.length > 0)
			this.widgets.forEach(w => body.append(w.el));
		else
			el.hide();

		this.#el = el;

		this.init(el, body);

		if (this.slider)
			body.touchSlider({item: 'div.widget'});

		return el;
	}

	get body() { return this.el.find('>div.group-body'); }

	init() {}

	show() { this.el.show(); }

	hide() { this.el.hide(); }

	destroy() {
		this.widgets.forEach(w => w.destroy());
		this.#el.remove();
		this.#el = null;
	}
}
