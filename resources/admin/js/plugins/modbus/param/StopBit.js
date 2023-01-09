import Arg from "./Arg";

export default class StopBit extends Arg {
	constructor() {
		super('s', {
			label: 'Количество стоповых битов',
			default: 1
		});
	}

	//-s	Количество стоповых битов, 1 или 2	1
	createInputEl() {
		let html = '<select>';
		html += '<option value="1">1</option>';
		html += '<option value="2">2</option>';
		html += '</select>';

		return $(html);
	}
}
