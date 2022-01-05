import {EventsTrait} from "@core.main";

function isEqual(a, b) {
	if (a.length != b.length)
		return false;

	const l = a.length;
	for (let i = 0; i < l; i++) {
		if (!in_array(a[i], b))
			return false;
	}

	return true;
}

class Room {
	constructor(data) {
		this.id = +data.id;
		this.key = data.key;
		this.name = data.name;
		this.light_state = data.light_state;
		this.main = !!data.main;
		this.lights = data.lights || [];
	}

	updateData(d, fireEvent) {
		this.lights = d.lights || [];

		if (this.light_state === d.light_state)
			return false;

		this.light_state = d.light_state;

		this.trigger('update');

		if (false !== fireEvent)
			home().trigger('update', this);

		return true;
	}

	devices() { return home().devices().filter(d => d.room_id === this.id); }

	device(id) { return this.devices().find(d => d.id === id); }

	command(action, data) {
		broadcaster().send({
			method: 'room.sendCommand',
			params: {room_id: this.id, action: action, data: data},
			//success: function () { home().update(r); },
			scope: this
		});
		//Http.getJSON('/room/command/' + this.id, {action: action, data: data}, home().update);
	}
}

Object.assign(Room.prototype, EventsTrait);

export default Room;
