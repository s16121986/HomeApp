import {EventsTrait} from "@core.main";

export default class Sensor {
	constructor(data) {
		this.id = +data.id;
		this.room_id = +data.room_id;
		this.pin = data.channel;
		this.name = data.name;
		this.room_name = data.room_name;
		this.key = data.type.replace('App\\Home\\Sensors\\', '').toLowerCase();
		this.type = data.type;
		this.enabled = !!data.enabled;
		this.favorite = !!data.favorite;
		this.updateData(data);
	}

	updateData(d) {
		this.state = +d.state;
		this.data = +d.data;

		this.trigger('update');
	}
}

Object.assign(Sensor.prototype, EventsTrait);
