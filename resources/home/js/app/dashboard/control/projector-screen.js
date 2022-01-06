import Device from "./device";

export default class ProjectorScreen extends Device {

	init(el) {
		super.init(el);

		this
			.addField('buttons', 'buttons', {
				buttons: [
					{id: 'open', text: 'Открыть'},
					{id: 'stop', text: '', icon: '<img src="/images/ui/16/pause.png" />'},
					{id: 'close', text: 'Закрыть'}],
				click: (key) => { this.device.command(key); }
			});
	}
}
