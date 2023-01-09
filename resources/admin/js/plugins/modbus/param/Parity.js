import Arg from "./Arg";

export default class Parity extends Arg {
	constructor() {
		super('p', {
			label: 'Контроль четности',
			default: 'even'
		});
	}

	createInputEl() {
		let html = '<select>';
		html += '<option value="none">none</option>';
		html += '<option value="even">even</option>';
		html += '<option value="odd">odd</option>';
		html += '</select>';

		return $(html);
	}
}
