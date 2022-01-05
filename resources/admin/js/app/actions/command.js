import {optionsFromItems, selectFromItems} from "./util";

let I = 0;

export default class Command {
	#el;
	#data;
	#entityField;
	#entityIdField;

	constructor(data) {
		this.#data = data || {};
	}

	get el() {
		if (this.#el)
			return this.#el;

		this.#el = $('<div class="item"></div>');

		this.#entityField = $(selectFromItems(app().commandEntities, {placeholder: ''}))
			.change(() => { this.update(); })
			.val(this.#data.entity)
			.appendTo(this.#el);

		this.#entityIdField = $('<select name="data[commands][' + I + '][entity_id]"></select>')
			.appendTo(this.#el);

		const inpt = (type, name, placeholder) => {
			return '<input type="' + type + '" name="data[commands][' + I + '][' + name + ']"'
				+ ' placeholder="' + placeholder + '"'
				+ ' value="' + (this.#data[name] || '') + '" />';
		};
		let html = '';
		//html += selectFromItems(app().commandEntities);
		//html += ;
		//html += '<option value=""></option>';

		//html += inpt('hidden', 'entity');
		//html += inpt('hidden', 'entity_id');
		html += inpt('text', 'command', 'Команда');
		html += inpt('text', 'data', 'Данные');
		this.#el.append(html);

		this.update();

		return this.#el;
	}

	update() {
		const entity = this.#entityField.val();
		this.#entityIdField.val('').hide();
		if (!entity)
			return;

		switch (entity) {
			case 'App\\Entities\\Scenario\\Command\\Home':

				return;
			case 'App\\Entities\\Scenario\\Command\\Room':
				this.#entityIdField.html(optionsFromItems(app().rooms, {placeholder: '--Комната--'}));
				break;
			case 'App\\Entities\\Scenario\\Command\\Device':
				this.#entityIdField.html(optionsFromItems(app().devices, {placeholder: '--Устройство--'}));
				break;
		}

		this.#entityIdField.show();
		if (this.#data.entity === entity)
			this.#entityIdField.val(this.#data.entity_id);
	}
}
