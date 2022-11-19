export default class Toggle {
	#el;

	constructor(id, params) {
		this.id = id;
		params = Object.assign({}, params);
		this.cls = params.cls;
		this.title = params.title;
		this.checked = params.checked;
		if (params.change)
			this.change = params.change;
	}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class="widget widget-toggle ' + this.cls + (this.checked ? ' active' : '') + '">'
			+ '<div class="widget-wrap">'
			+ '<div class="widget-title">' + (this.title || '') + '</div>'
			+ '<div class="ui-switch"></div>'
			+ '</div>'
			+ '</div>';
		const el = $(html);

		this.#el = el;

		el.click(() => {
			if (el.hasClass('disabled'))
				return;
			//this.toggleClass('active');
			this.change();
		});

		return el;
	}

	isRendered() { return !!this.#el; }

	setChecked(flag) {
		if (flag)
			this.el.addClass('active');
		else
			this.el.removeClass('active');
	}

	setDisabled(flag) {
		this.el[flag ? 'addClass' : 'removeClass']('disabled');
	}

	//get title() { return this.el.find('>div.widget-title'); }

	destroy() {
		if (this.isRendered())
			this.#el.remove();
	}
}
