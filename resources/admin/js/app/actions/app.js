export default class Application {
	static #instance;

	static getInstance() { return this.#instance ?? (this.#instance = new Application()); }

	#data;

	constructor() {
		const meta = document.head.querySelector('meta[name="metadata"]');
		this.#data = JSON.parse(meta.content);
		meta.remove();
	}

	get conditions() { return this.#data.conditions; }

	get scenarios() { return this.#data.scenarios; }

	get rooms() { return this.#data.rooms; }

	get devices() { return this.#data.devices; }
}

Object.assign(window, {
	app: function () { return Application.getInstance(); }
});
