import {selectFromItems} from "../util";

export default class Item {
	#el;
	#conditionField;
	#valueField;

	constructor(data) {}

	get el() {
		if (this.#el)
			return this.#el;

		this.#el = $('<div class="item"></div>');

		this.#conditionField = selectFromItems(app().conditions);
	}
}
