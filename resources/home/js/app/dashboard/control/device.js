import Container from "./container";
import Collection from "../../support/collection";
import Buttons from "./field/buttons";
import Switch from "./field/switch";
import Slider from "./field/slider";

function deviceGroup(device) {
	switch (device.type) {
		case 'App\\Home\\Devices\\LightPwm':
		case 'App\\Home\\Devices\\Light110':
		case 'App\\Home\\Devices\\LightRelay':
			return 'Освещение';
		case 'App\\Home\\Devices\\Fan':
			return 'Вентиляция';
		default:
			return 'Устройства';
	}
}

function fieldFactory(id, type, params) {
	switch (type) {
		case 'slider':
			return new Slider(id, params);
		case 'switch':
			return new Switch(id, params);
		case 'buttons':
			return new Buttons(id, params);
	}
}

export default class Device extends Container {
	#device;
	#fields;

	constructor(device, params) {
		super('device', params);

		this.#device = device;
		this.#device.bind('update', this.update, this);

		this.#fields = new Collection();
	}

	get device() { return this.#device; }

	updateState() {
		if (this.device.state)
			this.el.addClass('active');
		else
			this.el.removeClass('active');
	}

	init(el) {
		const device = this.device;
		let html = '<div class="image">' + device.icon + '</div>';
		html += '';
		html += '<div class="control-title">'
			+ '<div class="title">'
			+ '<div class="name">' + device.name + '</div>'
			+ '<div class="group">' + device.room_name + '<div class="separator"></div>' + deviceGroup(device) + '</div>'
			+ '</div>'
			+ '</div>';

		if (device.state)
			el.addClass('active');

		el.append(html);
	}

	addField(id, type, params) {
		if (!params)
			params = {};

		params.value = this.device.data(id);

		const field = fieldFactory(id, type, params);

		this.#fields.add(field);

		this.el.append(field.el);

		return this;
	}

	update() {
		this.#fields.forEach(field => { field.update(this.device.data(field.id)); });
	}

	destroy() {
		this.#device.unbind('update', this.update);

		this.#fields.destroy();
		this.#fields = null;

		super.destroy();
	}
}
