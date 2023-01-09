import Arg from "./Arg";

const baudRates = [110, 300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400, 57600, 115200, 128000, 256000];

export default class BaudRate extends Arg {
	constructor() {
		super('b', {
			label: 'Скорость передачи данных',
			default: 9600
		});
	}

	createInputEl() {
		let html = '<select>';
		baudRates.forEach(r => {
			html += '<option value="' + r + '">' + r + '</option>';
		});
		html += '</select>';

		return $(html);
	}
}
