export default class AbstractParam {
	#el;

	constructor(name, params) {
		this.name = name;
		this.params = params;
	}


	getEl() {
		if (this.#el)
			return this.#el;

		const params = this.params;
		const inputId = 'filter-' + this.name;
		let html = '<div class="form-field ' + (params.cls || '') + '">';
		if (params.label)
			html += '<label for="' + inputId + '">' + params.label + '</label>';
		html += '</div>';

		const el = this.#el = $(html);
		this.inputEl = this.createInputEl()
			.attr('id', inputId)
			.attr('name', name);
		el.append(this.inputEl);

		if (params.default)
			this.setValue(params.default);

		if (params.placeholder)
			this.inputEl.attr('placeholder', params.placeholder);

		this.init(el, this.inputEl);

		return el;
	}

	init() {}

	getInputEl() { return this.inputEl; }

	createInputEl() { return $('<input type="text" />'); }

	getValue() { return this.inputEl.val(); }

	setValue(value) { this.inputEl.val(value); }

	getDefault() { return this.params.default; }
}
