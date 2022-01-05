import Device from "./device";

export default class LightPwm extends Device {
	update() {
		if (this.device.state)
			this.el.addClass('active');
		else
			this.el.removeClass('active');
	}

	click() { this.command('toggle'); }
}
