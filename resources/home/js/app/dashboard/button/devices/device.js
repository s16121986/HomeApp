import Button from "../button";

export default class Device extends Button {
	#device;

	constructor(device, params) {
		super(Object.assign({
			cls: 'btn-device btn-' + device.key + (device.state ? ' active' : ''),
			icon: device.icon,
			title: device.name
		}, params));

		this.#device = device;
		device.bind('update', () => { this.update(); });
	}

	get device() { return this.#device; }

	update() {}

	click() { this.showActivity(); }

	touchhold() { this.showActivity(); }

	showActivity() { dashboard().roomSidebar.device(this.#device); }

	command(name, data) { this.#device.command(name, data); }
}
