//import Header from "./ui/header";
import Activities from "./ui/activities";
import Menu from "./ui/menu";
import RoomSidebar from "./activity/room/sidebar";

export default class Dashboard {
	static #instance;
	#el;
	#roomSidebar;

	//#deviceSidebar;

	static getInstance() { return this.#instance || (this.#instance = new Dashboard()); }

	constructor() {
		//this.header = new Header();
		this.activities = new Activities();
		this.menu = new Menu();
		this.#roomSidebar = new RoomSidebar();
	}

	get el() {
		if (this.#el)
			return this.#el;

		const el = $('<div class="app-dashboard"></div>');

		//el.append(this.header.el);
		el.append(this.activities.el);
		el.append(this.menu.el);
		$(document.body).append(this.#roomSidebar.el);
		//el.append(this.#roomSidebar.el);

		this.menu.current('home');

		return this.#el = el;
	}

	get currentActivity() { return this.activities.current(); }

	get roomSidebar() { return this.#roomSidebar; }

	//get deviceSidebar() { return this.#deviceSidebar; }

	activity(name) {
		this.activities.set(name);
		this.menu.current(name);

		return this.activities.current();
	}

	setLoading(flag) { this.el[flag ? 'addClass' : 'removeClass']('loading'); }
}
