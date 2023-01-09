import Arg from "./Arg";

export default class Address extends Arg {
	constructor(modules) {
		super('a', {
			label: 'Адрес устройства',
			default: modules[0].address
		});

		this.modules = modules;
	}

	createInputEl() {
		let html = '<select>';
		this.modules.forEach(m => {
			html += '<option value="' + m.address + '">' + m.name + '</option>';
		});
		html += '</select>';

		return $(html);
	}
}
