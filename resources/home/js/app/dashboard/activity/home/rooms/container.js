export default class Container {
	#el;

	constructor(name, params) {
		this.name = name;
		this.cls = params ? params.cls : name;
	}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class="room ' + this.cls + '"></div>';
		const el = $(html)

		this.#el = el;

		this.init(el);

		return el;
	}

	isRendered() { return !!this.#el; }

	init() {}

	show() { this.el.show(); }

	hide() { this.el.hide(); }
}
