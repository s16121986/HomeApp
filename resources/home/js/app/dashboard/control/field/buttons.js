import Field from "./field";

export default class Buttons extends Field {
	constructor(key, params) {
		super(key, 'buttons', params);

		let html = '<div class="inner">';
		params.buttons.forEach(btn => {
			html += '<button class="' + btn.id + '" data-action="' + btn.id + '">'
				+ (btn.icon || '')
				+ (btn.text || '')
				+ '</button>';
		});
		html += '</div>';

		this.el.append(html)
			.find('button').click(function () { params.click($(this).data('action')); });
	}
}
