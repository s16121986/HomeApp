import Device from "./device";

export default class LightRelay extends Device {

	init(el) {
		super.init(el);

		$('<div class="ui-switch"></div>')
			.appendTo(el.find('div.control-title'))
			.click(() => { this.device.toggle(); });
	}

	update() {
		this.updateState();
	}
}
