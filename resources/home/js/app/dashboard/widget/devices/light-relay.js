import Device from "./device";

export default class LightRelay extends Device {
	constructor(device, params) {
		super(device, params);
	}

	update() {
		this.updateState();
	}

	//click() { this.command('toggle'); }
}
