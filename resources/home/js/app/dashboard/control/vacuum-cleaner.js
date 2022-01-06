import Device from "./device";

export default class VacuumCleaner extends Device {

	init(el) {
		super.init(el);

		this
			.addField('buttons', 'buttons', {
				buttons: [
					{id: 'start', text: 'Начать уборку'},
					{id: 'stop', text: '', icon: '<img src="/images/ui/16/pause.png" />'},
					{id: 'home', text: '', icon: '<img src="/images/ui/16/home.png" />'}],
				click: (key) => { this.device.command(key); }
			});
	}
}
