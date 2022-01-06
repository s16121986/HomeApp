import Device from "./device";
import Switch from "./field/switch";


export default class WC extends Device {

	#rows = {};

	init(el) {
		super.init(el);

		this
			.addField('enabled', 'switch', {
				label: 'Включено',
				change: (state) => { this.device.command(state ? 'enable' : 'disable'); }
			})
			.addField('irEnabled', 'switch', {
				label: 'ИК датчик',
				change: (state) => { this.device.command(state ? 'enable' : 'disable'); }
			});
	}
}
