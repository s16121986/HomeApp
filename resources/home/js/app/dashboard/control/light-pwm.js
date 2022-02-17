import Device from "./device";

export default class LightPwm extends Device {
	#slider;

	init(el) {
		super.init(el);

		$('<div class="ui-switch"></div>')
			.appendTo(el.find('div.control-title'))
			.click(() => { this.device.toggle(); });

		this.addField('brightness', 'slider', {
			label: 'Яркость',
			change: (p) => {
				if (0 === p)
					this.device.command('brightness', 1);
				else
					this.device.command('brightness', p);
			}
		});
	}

	update() {
		super.update();
		this.updateState();
	}
}
