import {EventsTrait} from "@core.main";

export default class Settings {
	#data = {};

	constructor(data) {
		this.#data = data || {};
		//this.id = data.name;
		//this.value = data.value;
	}

	get(name) { return this.#data[name]; }

	updateData(data) {
		this.#data = data;

		this.trigger('update');
	}

	updateValue(data) {
		this.#data[data.name] = data.value;
		this.trigger('change', data.name, data.value);
	}
}

Object.assign(Settings.prototype, EventsTrait);
