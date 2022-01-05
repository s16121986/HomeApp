export default class Scenario {
	constructor(data) {
		this.id = +data.id;
		this.name = data.name;
		this.icon = data.icon;
	}

	command() {
		broadcaster().send({
			method: 'scenario.set',
			params: {scenario_id: this.id},
			scope: this
		});
	}
}
