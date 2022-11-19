import Home from "../activity/home";
import Rooms from "../activity/rooms";
import Settings from "../activity/settings";

export default class Activities {
	#el;
	#prev;
	#current;
	#items;

	constructor() {
		this.#items = [
			new Home(),
			new Rooms(),
			new Settings(),
			//new Settings()
		];
	}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class="activities-wrap"></div>';

		const el = $(html);

		this.#items.forEach(activity => el.append(activity.el));

		this.#current = this.#items[0];
		this.#current.show();

		return this.#el = el;
	}

	current() { return this.#current; }

	get(name) { return this.#items.find(a => a.name === name); }

	set(name) {
		if (this.#current.name === name)
			return;

		this.#prev = this.#current;
		this.#current.hide();
		this.#current = this.get(name);
		this.#current.show();
	}

	back() {
		if (!this.#prev)
			return;

		this.#prev.hide();
		this.#current = this.#prev;
		this.#current.show();
		this.#prev = null;
	}
}
