import {EventsTrait} from "@core.main";
import Collection from "../support/collection";
import Device, {DEVICE_GROUPS} from "./device";
import Sensor from "./sensor";
import Room from "./room";
import Scenario from "./scenario";

class Home {
	static #instance;

	static getInstance() {
		return this.#instance || (this.#instance = new Home());
	}

	#data;
	#rooms;
	#devices;
	#sensors;
	#scenarios;

	constructor() {
		this.#rooms = new Collection();
		this.#devices = new Collection();
		this.#sensors = new Collection();
		this.#scenarios = new Collection();
	}

	//const sensorsData = new app.home.SensorsData();
	//const settings = new app.home.Settings();
	//var lastUpdateTime;

	boot(data) {
		this.#data = data.home;

		data.rooms.forEach(d => { this.#rooms.add(new Room(d)); });

		data.devices.forEach(d => {
			if (d.group === DEVICE_GROUPS.SENSOR)
				this.#sensors.add(new Sensor(d));
			else
				this.#devices.add(new Device(d));
		});

		data.scenarios.forEach(r => { this.#scenarios.add(new Scenario(r)); });

		//sensorsData.setData(params.data);
		//settings.update(params.settings);

		this.trigger('ready');
	}

	update(data) {
		if (!data.devices)
			return;

		const self = this;
		let flag = false;

		data.devices.forEach(d => {
			const m = self.#devices.get(+d.id);
			if (m)
				flag = m.updateData(d, false) || flag;
		});

		if (flag)
			this.trigger('devices-update');

		data.rooms.forEach(r => { self.#rooms.get(r.id).updateData(r, false); });

		//sensorsData.update(data.data);
		//settings.update(data.settings);

		this.trigger('update');
	}

	stateRefresh(data) {

	}

	get(name) { return this.#data[name]; }

	getData() { return sensorsData; }

	getSettings() { return settings; }

	room(key) { return this.#rooms.find(r => { return r.key === key || r.id === +key; }); }

	rooms() { return this.#rooms; }

	device(id) { return this.#devices.find(d => d.id === id); }

	devices() { return this.#devices; }

	sensors() { return this.#sensors; }

	scenarios() { return this.#scenarios; }

	command(action, data) {
		broadcaster().send({
			method: 'home.sendCommand',
			params: {action: action, data: data || 0},
			//success: function () { this.update(); },
			scope: this
		});
	}

}

Object.assign(Home.prototype, EventsTrait);

export default Home;
