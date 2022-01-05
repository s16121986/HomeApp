import Container from "./container";

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

export default class Device extends Container {
	#device;

	constructor(device, params) {
		super('device', params);

		this.#device = device;
		this.#device.bind('update', this.update, this);
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

	update() {}

	destroy() {
		this.#device.unbind('update', this.update);

		super.destroy();
	}
}
