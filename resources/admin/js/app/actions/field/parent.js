export default class ParentField {
	#el;
	#parentField;
	#idField;
	#select;

	constructor() {
		this.#parentField = $('#form_data_parent');
		this.#idField = $('#form_data_parent_id');
		this.#el = this.#parentField.parent();
		this.#select = $('<select></select>')
			.change(() => { this.#idField.val(this.#select.val()); })
			.appendTo(this.#el);
	}

	show() { this.#el.show(); }

	hide() { this.#el.hide(); }

	reset() {
		this.#parentField.val('');
		this.#select.change();
	}

	load(key, label) {
		this.#parentField.val(key);
		this.#idField.val('');
		this.#el.find('label').html(label);

		let html = '<option></option>';
		app()[key].forEach(r => {
			html += '<option value="' + r.id + '">' + r.name + '</option>';
		});
		this.#select.html(html);

		this.show();
	}
}
