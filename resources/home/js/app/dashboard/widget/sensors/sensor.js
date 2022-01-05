import Container from "../container";
import icons from "../../../ui/icons";

export default class Sensor extends Container {
	#sensor;

	constructor(sensor, params) {
		super('sensor-' + sensor.id, Object.assign({
			cls: 'widget-device widget-sensor widget-' + sensor.key + ' ' + (sensor.class || '')
		}, params));

		//sensor.bind('update', this.update, this);

		this.#sensor = sensor;
	}

	/*init(el, body) {
		Device.prototype.init.call(this, el, body);
	}*/

	get sensor() { return this.#sensor; }

	init(el, body) {
		const sensor = this.#sensor;

		let html = '<div class="image">' + (sensor.icon || '') + '</div>';
		//html += '<div class="icon">' + (device.icon ? devices[device.icon] : '') + '</div>';
		html += '<div class="name">';
		html += '<div class="g">' + sensor.room_name + '</div>';
		html += '<div class="n">' + sensor.name + '</div>';
		html += '</div>';

		body.html(html);
	}

	click() { this.showActivity(); }

	update() {}

	command(name, data) { this.#sensor.command(name, data); }

	destroy() {
		//this.sensor.unbind('update', this.update);
		super.destroy();
	}

	showActivity() {
		//dashboard().show(RoomActivity.deviceFactory(this.#device));
	}
}
