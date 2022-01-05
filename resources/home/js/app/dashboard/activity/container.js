import {EventsTrait} from "@core.main";

export default class Container {
	#el;

	constructor(name, params) {
		this.name = name;
		this.cls = params ? params.cls : name;
	}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class="activity activity-' + this.cls + '" style="display:none;"></div>';
		const el = $(html)

		this.#el = el;

		this.init(el);

		this.trigger('ready');

		return el;
	}

	isRendered() { return !!this.#el; }

	init() {}

	show() {
		this.el.show();
		this.trigger('show');
	}

	hide() {
		this.el.hide();
		this.trigger('hide');
	}

	destroy() {
		this.trigger('destroy');
		this.el.remove();
	}
}

Object.assign(Container.prototype, EventsTrait);
