export default class Collection {
	#items = [];

	constructor() {}

	getAll() { return this.#items; }

	get(id) { return this.#items.find(item => item.id === id); }

	find(fn) { return this.#items.find(fn); }

	add(item) { this.#items.push(item); }

	remove(item) {}

	count() { return this.#items.length; }

	forEach(fn) { return this.#items.forEach(fn); }

	filter(fn) { return this.#items.filter(fn); }

	map(fn) { return this.#items.map(fn); }

}
