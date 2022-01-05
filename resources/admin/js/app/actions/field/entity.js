export default class EntityField {
	#entityField;
	#idField;
	#select;

	constructor(key) {
		this.#entityField = $('#form_data_' + key)
			.change(() => { this.load(this.#entityField.val()); });
		this.#idField = $('#form_data_' + key + '_id');
		this.#select = $('<select></select>')
			.change(() => { this.#idField.val(this.#select.val()); })
			.hide()
			.appendTo(this.#entityField.parent());

		const entity = this.#entityField.val();
		const id = this.#idField.val();
		if (entity) {
			this.load(entity);

			this.#select.val(id || '');
			this.#idField.val(id || '');
		}
	}

	load(entity) {
		this.#idField.val('');

		const items = EntityField.entityItems(entity);

		if (0 === items.length) {
			this.#select
				.html('<option></option>')
				.hide();
		} else {
			let html = '<option></option>';
			items.forEach(r => { html += '<option value="' + r.id + '">' + r.name + '</option>'; });
			this.#select
				.html(html)
				.show();
		}
	}

	static entityItems(key) {
		switch (key) {
			case 'App\\Home\\Home':
				return [];
			case 'App\\Models\\Home\\Device':
				return app().devices;
			case 'App\\Models\\Home\\Room':
				return app().rooms;
			case 'App\\Models\\Scenario\\Scenario':
				return app().scenarios;
			default:
				return [];
		}
	}
}
