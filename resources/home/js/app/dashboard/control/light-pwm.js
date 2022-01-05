import Device from "./device";
import Slider from "../../ui/slider";

export default class LightPwm extends Device {

	init(el) {
		super.init(el);

		let html = '<div class="row row-slider">'
			+ '<div class="row-title">Яркость</div>'
			+ '</div>';

		el.append(html);

		$('<div class="ui-switch"></div>')
			.appendTo(el.find('div.control-title'))
			.click(() => { this.device.toggle(); });

		const slider = new Slider({value: this.device.data});
		el.append(slider.el);
		slider.bind('change', (p) => {
			if (0 === p)
				this.device.off();
			else
				this.device.command('brightness', p);
		});
	}

	update() {
		this.updateState();
	}
}
