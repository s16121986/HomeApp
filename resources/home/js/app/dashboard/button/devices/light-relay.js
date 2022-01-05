import Device from "./device";

export default class LightRelay extends Device {
	constructor(device, params) {
		super(device, params);
	}

	update() {
		if (this.device.state)
			this.el.addClass('active');
		else
			this.el.removeClass('active');
	}

	click() { this.command('toggle'); }
}
