import Container from "./container";

export default class Scenario extends Container {
	#scenario;

	constructor(scenario, params) {
		super('scenario-' + scenario.id, Object.assign({
			cls: 'widget-device widget-scenario'
		}, params));

		this.#scenario = scenario;
	}

	/*init(el, body) {
		Device.prototype.init.call(this, el, body);
	}*/

	get scenario() { return this.#scenario; }

	init(el, body) {
		const scenario = this.#scenario;

		//el.append('');

		let html = '<div class="image"><i class="icon-' + (scenario.icon || '') + '"></i></div>';
		//html += '<div class="inner">';
		//html += '<div class="icon">' + (device.icon ? devices[device.icon] : '') + '</div>';
		html += '<div class="name"><div class="n">' + scenario.name + '</div></div>';
		//html += '</div>';


		body.html(html);
	}

	click() { this.#scenario.command(); }
}
