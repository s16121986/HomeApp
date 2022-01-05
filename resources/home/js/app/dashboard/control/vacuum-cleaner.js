import Device from "./device";

export default class VacuumCleaner extends Device {

	init(el) {
		super.init(el);

		const self = this;
		const actionsEl = $('<div class="control-buttons">'
			+ '<div class="inner">'
			+ '<button class="down" data-action="start" title="Уборка">Начать уборку</button>'
			+ '<button class="pause" data-action="stop" title="Пауза"><img src="/images/ui/16/pause.png" /></button>'
			+ '<button class="home" data-action="home" title="Домой"><img src="/images/ui/16/home.png" /></button>'
			+ '</div>'
			+ '</div>').appendTo(el);

		actionsEl.find('button').click(function () {
			self.device.command($(this).data('action'));
		});
	}
}
