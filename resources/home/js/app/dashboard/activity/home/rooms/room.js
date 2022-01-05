import Container from "./container";
import WidgetsGroup from "../../../widget/group"
import widgetFactory from "../../../widget/devices/factory";

export default class Room extends Container {
	#key;

	constructor(key) {
		super(key);

		this.#key = key;
	}

	init(el) {
		const room = home().room(this.#key);

		const lights = new WidgetsGroup({
			cls: 'devices-group',
			title: 'Освещение',
			widgets: room.devices()
				.filter(device => device.isLight())
				.map(device => { return widgetFactory(device); })
		});
		el.append(lights.el);

		const others = new WidgetsGroup({
			cls: 'devices-group',
			title: 'Устройства',
			widgets: room.devices()
				.filter(device => !device.isLight())
				.map(device => { return widgetFactory(device); })
		});
		el.append(others.el);
	}
}
