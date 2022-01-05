export default class Container {
	#el;

	constructor(name, params) {
		this.name = name;
		params = Object.assign({}, params);
		this.cls = params.cls || ('control-' + name);
		this.title = params.title;
	}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class="control ' + this.cls + '"></div>';
		const el = $(html);

		this.#el = el;

		this.init(el);

		return el;
	}

	isRendered() { return !!this.#el; }

	init() {}

	destroy() {
		if (this.#el)
			this.#el.remove();
	}
}
