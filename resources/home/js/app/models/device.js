import {EventsTrait} from "@core.main";
import icons from "../ui/icons"

const STATE_ON = 1;

export const DEVICE_GROUPS = {
	SENSOR: 1,
	DEVICES: 2,
	LIGHT: 3,
	PERIPHERALS: 4,
	LIGHTNING: 5
};

function iconFactory(data) {
	if (data.icon)
		return '<i class="icon-' + (data.icon || '') + '"></i>';//devices[data.icon] || icons.bulb;

	//return getSvg('roborock-vacuum');
	switch (data.type) {
		case 'App\\Home\\Devices\\Fan':
			return '<i class="icon-fan"></i>';
		case 'App\\Home\\Devices\\Curtains':
			return '<i class="icon-curtains"></i>';
		case 'App\\Home\\Devices\\ProjectorScreen':
			return '<i class="icon-projector_screen"></i>';
		case 'App\\Home\\Devices\\VacuumCleaner':
			return '<i class="icon-vacuum_cleaner"></i>';
		case 'App\\Home\\Devices\\Gidrolock':
			return icons.gidrolock;
		case 'App\\Home\\Devices\\Warmfloor':
		//return app.ui.svg.icons.;
		default:
			return '<i class="icon-bulb"></i>';
	}
}

class Device {
	#data;

	constructor(data) {
		this.id = +data.id;
		this.room_id = +data.room_id;
		this.room_key = data.room_key;
		this.room_name = data.room_name;
		this.channel = data.channel;
		this.key = data.type.replace('App\\Home\\Devices\\', '').toLowerCase();
		this.group = +data.group;
		this.name = data.name;
		//this.icon = data.icon;
		this.type = data.type;
		this.icon = iconFactory(data);
		this.class = data.class;
		this.module_type = +data.module_type;
		this.enabled = !!data.enabled;
		this.main = !!data.main;
		this.favorite = !!data.favorite;

		this.setData(data);
	}

	//get (name) { return this.#data[name]; };

	data(key, value) {
		if (undefined === value)
			return this.#data[key];

		this.#data[key] = value;
	}

	setData(d) {
		this.state = +d.state;
		this.#data = is_object(d.data) ? d.data : {};

		return this;
	}

	updateData(d, fireEvent) {
		if (this.state === +d.state)// && this.data.wasChanged(d.data)
			return false;

		this.setData(d);
		this.trigger('update');

		if (false !== fireEvent)
			home().trigger('update', this);

		return true;
	}

	command(action, data, callback) {
		if (is_function(data)) {
			callback = data;
			data = undefined;
		}

		let params = {device_id: this.id, action: action};
		if (undefined !== data)
			params.data = data;

		broadcaster().send({
			method: 'device.sendCommand',
			params: params,
			success: function (r) {
				if (r && r.data)
					this.updateData(r.data, false);

				//home().update(r);
				//callback.call(self);
			},
			scope: this
		});
	}

	room() { return home().room(this.room_key); }

	isEnabled() { return this.enabled; }

	isLight() { return this.group === DEVICE_GROUPS.LIGHT || this.group === DEVICE_GROUPS.LIGHTNING; }

	isStatable() {
		return in_array(this.type, [
			'App\\Home\\Devices\\Fan',
			'App\\Home\\Devices\\LightRelay',
			'App\\Home\\Devices\\Light110',
			'App\\Home\\Devices\\LightPwm',
			'App\\Home\\Devices\\Flowers',
		]);
	}

	isOn() { return (this.state & STATE_ON) != 0; }

	off() { return this.command('off'); }

	on() { return this.command('on'); }

	toggle() { return this.command('toggle'); }

}

Object.assign(Device.prototype, EventsTrait);

export default Device;
