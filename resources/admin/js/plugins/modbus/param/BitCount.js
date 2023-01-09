import Arg from "./Arg";

export default class BitCount extends Arg {
	constructor() {
		super('d', {
			label: 'Количество передаваемых бит данных',
			default: 8
		});
	}

	createInputEl() {
		let html = '<select>';
		html += '<option value="8">8</option>';
		html += '<option value="7">7</option>';
		html += '</select>';

		return $(html);
	}
}
