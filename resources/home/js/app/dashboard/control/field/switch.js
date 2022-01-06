import Field from "./field";

export default class Switch extends Field {
	constructor(key, params) {
		super(key, 'switch', params);

		$('<div class="ui-switch' + (params.value ? ' active' : '') + '"></div>')
			.click((e) => { params.change(); })
			.appendTo(this.el);
	}

	update(state) {
		this.el.find('div.ui-switch')[state ? 'addClass' : 'removeClass']('active');
	}
}
