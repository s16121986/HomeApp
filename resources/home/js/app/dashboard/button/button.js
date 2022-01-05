export default class Button {
	#el;

	constructor(params) {
		Object.assign(this, params);
	}

	get el() {
		if (this.#el)
			return this.#el;

		const el = $('<button type="' + (this.type || 'button') + '" title="' + (this.title || '') + '" class="btn ' + (this.cls || '') + '">'
			+ (this.icon || '')
			+ (this.text || '')
			+ '</button>');

		el
			.touchHold()
			.click(e => {
				e.stopPropagation();
				this.click.call(this)
			})
			.bind('touchhold', (e) => {
				this.touchhold.call(this)
			});

		return this.#el = el;
	}

	click() {}

	touchhold() {}
}
