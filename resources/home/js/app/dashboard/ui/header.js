import Time from "../widget/time";
import icons from "../../ui/icons";

export default class Header {
	#el;

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<header></header>';

		const el = $(html);

		const widgets = {
			time: new Time()
		};

		el.append(widgets.time.el);

		$('<button class="power-off">' + icons.powerOff + '</button>')
			.appendTo(el)
			.click(e => { home().command('lightToggle'); });

		return this.#el = el;
	}
}
