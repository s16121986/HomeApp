export default class Element {
	#el;

	constructor() {}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class=""></div>';
		const el = $(html);

		return this.#el = el;
	}
}
