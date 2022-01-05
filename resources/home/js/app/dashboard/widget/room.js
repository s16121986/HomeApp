import Container from "./container";
import DeviceBtn from "../button/devices/device";
import buttonFactory from "../button/devices/factory";

export default class Room extends Container {
	#room;

	constructor(room) {
		//const room = home().room(key);

		super(room.key, {
			cls: 'widget-room room-' + room.key,
			title: room.name
		});

		this.#room = room;
	}

	get room() { return this.#room; }

	get key() { return this.#room.key; }

	init(el, body) {
		//let buttons = {};

		/*buttons.power = new PowerBtn({
			state: this.#room.light_state,
			click: () => { this.#room.command('lightToggle'); }
		});
		el.append(buttons.power.el);*/
		/*const state = $('<div class="light-state' + (this.#room.light_state ? ' active' : '') + '">' + icons.powerOff + '</div>')
			.appendTo(el.find('>div.widget-title'));

		this.#room.bind('update', function () {
			if (this.light_state)
				state.addClass('active');
			else
				state.removeClass('active');
		});*/

		/*el.find('>div.widget-title').click((e) => {
			e.stopPropagation();
			dashboard().show(new RoomActivity(this.#room));
		});*/

		let wrap = $('<div class="light-buttons"></div>').appendTo(body);

		this.#room.devices()
			.filter(device => device.main && device.isLight())
			.forEach(device => {
				const btn = buttonFactory(device);
				//buttons['device-' + device.id] = btn;
				wrap.append(btn.el);
			});

		wrap = $('<div class="other-buttons"></div>').appendTo(body);

		this.#room.devices()
			.filter(device => device.main && !device.isLight())
			.forEach(device => {
				const btn = new DeviceBtn(device);
				wrap.append(btn.el);
			});
	}

	click() {
		//this.#room.command('lightToggle');
		dashboard().roomSidebar.room(this.#room);
	}
}
