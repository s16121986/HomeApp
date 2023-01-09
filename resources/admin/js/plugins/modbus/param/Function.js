import Arg from "./Arg";

export default class Function extends Arg {
	constructor() {
		super('t', {
			label: 'Код функции',
			default: '0x01'
		});
	}

	createInputEl() {
		let html = '<select>';
		html += '<option value="0x01">Read Coils</option>';
		html += '<option value="0x02">Read Discrete Inputs</option>';
		html += '<option value="0x03">Read Holding Registers</option>';
		html += '<option value="0x04">Read Input Registers</option>';
		html += '<option value="0x05">Write Single Coil</option>';
		html += '<option value="0x06">Write Single Register</option>';
		html += '<option value="0x0F">Write Multiple Coils</option>';
		html += '<option value="0x10">Write Multiple Register</option>';
		html += '</select>';

		return $(html);
	}
}
