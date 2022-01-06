class Data {
	#el;
	#input;
	#fields = {};

	constructor(input) {
		this.#input = input;
		this.#el = $('<div class="condition-data"></div>').appendTo(input.parent());
		this.hide();
	}

	addField(name, label, field) {
		const wrap = $('<div class="form-field field-required"><label for="">' + label + '</label></div>')
			.appendTo(this.#el);

		this.#fields[name] = field
			.change(() => { this.#input.val(this.toString()); })
			.appendTo(wrap);

		return this;
	}

	addSelect(name, label, items) {
		let html = '<select>';
		html += '<option></option>';
		items.forEach(r => { html += '<option value="' + r.id + '">' + r.name + '</option>'; });
		html += '</select>';

		return this.addField(name, label, $(html));
	}

	reset() {
		this.#el.html('');
		this.#fields = {};
	}

	show() { this.#el.show(); }

	hide() { this.#el.hide(); }

	setData(data) {
		if (!data)
			return;

		data = JSON.parse(data);
		for (let i in data) {
			if (this.#fields[i])
				this.#fields[i].val(data[i]);
		}
	}

	toString() {
		let data = {};
		for (let i in this.#fields) {
			data[i] = this.#fields[i].val();
		}

		return JSON.stringify(data);
	}
}

export default class ConditionField {
	#typeField;
	#dataField;
	#data;

	constructor(key) {
		this.#dataField = $('#form_data_data');
		this.#typeField = $('#form_data_' + key)
			.change(() => { this.update(); });
		this.#data = new Data(this.#dataField);
		this.update();
		this.#data.setData(this.#dataField.val());
	}

	update() {
		const type = this.#typeField.val();
		this.#data.reset();

		switch (type) {
			case 'App\\Entities\\Scenario\\Condition\\DeviceState':
				this.#data
					.addSelect('device_id', 'Устройство', app().devices)
					.addSelect('state', 'Состояние', [{id: 0, name: 'Выключено'}, {id: 1, name: 'Включено'}]);
				break;
			case 'App\\Entities\\Scenario\\Condition\\RoomState':
				this.#data
					.addSelect('room_id', 'Комната', app().rooms)
					.addSelect('state', 'Состояние', [{id: 0, name: 'Выключено'}, {id: 1, name: 'Включено'}]);
				break;
			case 'App\\Entities\\Scenario\\Condition\\TimeEqual':
				let hours = [];
				for (let i = 0; i < 24; i++) {
					const s = (i > 9 ? i : '0' + i) + ':00';
					hours[hours.length] = {id: s, name: s};
				}
				this.#data.addSelect('time', 'Время', hours);
				break;
			case 'App\\Entities\\Scenario\\Condition\\DayTime':
				this.#data.addSelect('daytime', 'Время', [{id: 'd', name: 'День'}, {id: 'n', name: 'Ночь'}]);
				break;
			default:
				this.#data.hide();
				return;
		}

		this.#data.show();
	}
}
