import Container from "../container";

export default class Device extends Container {
	#device;

	constructor(device, params) {
		super('device-' + device.id, Object.assign({
			cls: 'widget-device widget-' + device.key + ' ' + (device.class || '') + (device.isOn() ? ' active' : '')
		}, params));

		device.bind('update', this.update, this);

		this.#device = device;
	}

	/*init(el, body) {
		Device.prototype.init.call(this, el, body);
	}*/

	get device() { return this.#device; }

	init(el, body) {
		const device = this.#device;

		//body.append('');

		let html = '<div class="image">' + (device.icon || '') + '</div>';
		//html += '<div class="inner">';

		if (this.isStatable()) {
			html += '<div class="ui-switch"></div>';

			if (device.state)
				this.el.addClass('active');
		}

		//html += '<div class="icon">' + (device.icon ? devices[device.icon] : '') + '</div>';
		html += '<div class="name">';
		html += '<div class="g">' + device.room_name + '</div>';
		html += '<div class="n">' + device.name + '</div>';
		html += '</div>';
		//html += '</div>';


		body.html(html);

		body.find('div.ui-switch').click((e) => {
			e.stopPropagation();

			this.command('toggle');

			this.click();
		});
	}

	isStatable() { return this.device.isStatable(); }

	updateState() {
		if (this.device.state)
			this.el.addClass('active');
		else
			this.el.removeClass('active');
	}

	click() { this.showActivity(); }

	update() {
		if (this.isStatable())
			this.updateState();
	}

	command(name, data) { this.#device.command(name, data); }

	destroy() {
		this.device.unbind('update', this.update);
		super.destroy();
	}

	showActivity() {
		dashboard().roomSidebar.device(this.#device);
	}
}
