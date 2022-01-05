import Device from "./device";

export default class ProjectorScreen extends Device {

	init(el) {
		super.init(el);

		const self = this;
		const actionsEl = $('<div class="control-buttons">'
			+ '<div class="inner">'
			+ '<button class="open" data-action="open">Открыть</button>'
			+ '<button class="pause" data-action="stop" title="Пауза"><img src="/images/ui/16/pause.png" /></button>'
			+ '<button class="close" data-action="close">Закрыть</button>'
			+ '</div>'
			+ '</div>').appendTo(el);

		actionsEl.find('button').click(function () {
			self.device.command($(this).data('action'));
		});
	}
}
