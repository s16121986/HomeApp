import {EventsTrait} from "@core.main";
import icons from "../../../ui/icons";

export default class Sidebar {
	#el;
	#collapsed = true;

	constructor(name, params) {
		this.name = name;
		this.cls = params ? params.cls : name;
	}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class="sidebar sidebar-' + this.cls + '" style="display:none;">';
		html += '<div class="sidebar-header">'
			+ '<div class="btn-back">' + icons.back + '</div>'
			+ '<div class="title"></div>'
			+ '</div>';
		html += '<div class="sidebar-content"></div>';
		html += '</div>';

		const el = $(html);

		el.find('div.btn-back').click(() => { this.hide(); });

		this.#el = el;

		this.init(el, this.content);

		this.trigger('ready');

		return el;
	}

	get content() { return this.el.find('>div.sidebar-content'); }

	isCollapsed() { return this.#collapsed; }

	title(s) { this.el.find('>div.sidebar-header>div.title').html(s); }

	isRendered() { return !!this.#el; }

	init() {}

	show(activity) {
		this.#collapsed = false;
		const el = this.el;//.hide();
		//this.activities.el.append(el);
		const w = el.outerWidth();
		el
			.css('margin-right', -w)
			.show()
			.animate({'margin-right': 0});
		//activity.show();
	}

	hide(activity) {
		this.#collapsed = true;
		this.el.animate({'margin-right': -this.el.outerWidth()}, () => {
			this.el.hide();
			//activity.destroy();
		});
	}
}

Object.assign(Sidebar.prototype, EventsTrait);
