import Device from "./device";

export default class WCFlowers extends Device {

	init(el) {
		super.init(el);

		$('<div class="ui-switch"></div>')
			.appendTo(el.find('div.control-title'))
			.click(() => { this.device.command('toggle'); });

		this
			.addField('brightness', 'slider', {
				label: 'Яркость фитолампы',
				change: (p) => {
					if (0 === p)
						this.device.off();
					else
						this.device.command('brightness', p);
				}
			})
			.addField('buttons', 'buttons', {
				buttons: [{id: 'irrigate', text: 'Полив'}],
				click: (key) => { this.device.command(key); }
			});
	}

	update() {
		this.updateState();
	}
}
