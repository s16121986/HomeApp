import {EventsTrait} from "@core.main";

class Application {
	static #instance;

	static getInstance() { return this.#instance || (this.#instance = new Application()); }

	boot() {
		broadcaster()
			.send({
				method: 'home.getInfo',
				success: function (result) {
					home().boot(result);
					//this.#info = result;
					this.trigger('ready');
				},
				scope: this
			})
			.onMessage('room.stateChanged', (result) => { home().room(result.id).updateData(result); })
			.onMessage('device.stateChanged', (result) => { home().device(result.id).updateData(result); })
			.onMessage('home.stateRefresh', (result) => { home().stateRefresh(result); });
	}
}

Object.assign(Application.prototype, EventsTrait);

export default Application;
