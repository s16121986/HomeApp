export default class Field {
	#el;
	#id;

	constructor(id, type, params) {
		this.#id = id;
		this.#el = $('<div class="field field-' + type + ' field-' + id + '">'
			+ (params.label ? '<div class="label">' + params.label + '</div>' : '')
			+ '</div>');
	}

	get id() { return this.#id; }

	get el() { return this.#el; }

	update() {}

	destroy() {
		this.#id = null;
		this.#el.remove();
		this.#el = null;
	}
}
