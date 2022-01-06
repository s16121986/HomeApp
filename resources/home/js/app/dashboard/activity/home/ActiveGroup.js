import WidgetsGroup from "../../widget/group"
import widgetDevice from "../../widget/devices/factory";

function activeDevices() {
	return home().devices().filter(device => device.isStatable());
}

export default class ActiveGroup extends WidgetsGroup {
	init() {
		activeDevices().forEach(d => { d.bind('update', this.update, this); });
		this.update();
	}

	update() {
		const devices = activeDevices().filter(d => d.isOn());
		const body = this.body;

		body.html('');

		if (devices.length === 0)
			this.hide();
		else {

			devices.forEach(d => {
				const w = widgetDevice(d);
				body.append(w.el)
			});

			this.show();
		}
	}
}
