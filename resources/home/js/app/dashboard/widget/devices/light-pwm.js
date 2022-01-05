import Device from "./device";

export default class LightPwm extends Device {

	update() {
		this.updateState();
	}

	//click() { this.command('toggle'); }
}
