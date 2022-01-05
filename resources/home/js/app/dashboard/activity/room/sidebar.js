import Container from "../ui/sidebar";
import WidgetsGroup from "../../widget/group";
import widgetFactory from "../../widget/devices/factory";
import controlFactory from "../../control/factory";
import RoomTabs from "./tabs";
import icons from "../../../ui/icons";

export default class Sidebar extends Container {
	#room;
	#device;
	#tabs;
	#groups = {};
	#widgets = [];
	#control;

	constructor() {
		super('room', {
			cls: 'room'
		});

		//this.#room = room;
		this.#tabs = new RoomTabs();
	}

	init(el, content) {
		content.append(this.#tabs.el);
		content.append('<div class="room-inner"></div>');
		$('<div class="state">' + icons.powerOff + '</div>')
			.click(() => { this.#room.command('lightToggle'); })
			.appendTo(this.el.find('div.sidebar-header'));
	}

	device(device) {
		this.room(device.room());

		this.#device = device;

		if (this.#control)
			this.#control.destroy();

		if (this.isRendered())
			this.update();
	}

	room(room) {
		if (this.isCollapsed())
			this.show();

		if (this.#room === room)
			return;

		this.reset();

		this.#room = room;
		this.#tabs.select(room.key);

		this.title(this.#room.name);

		const el = this.el;
		el.attr('class', 'sidebar sidebar-room room-' + this.#room.key);

		const wrap = this.content.find('>div.room-inner');

		wrap.html('');

		this.#groups.lights = new WidgetsGroup({
			cls: 'lights-group',
			title: 'Освещение',
			widgets: this.#room.devices()
				//.filter(device => device.id !== this.#device.id)
				.filter(device => device.isLight())
				.map(device => {
					return this.#widgets[this.#widgets.length] = widgetFactory(device, {click: () => { this.device(device); }});
				})
		});
		wrap.append(this.#groups.lights.el);

		this.#groups.devices = new WidgetsGroup({
			cls: 'devices-group',
			title: 'Устройства',
			widgets: this.#room.devices()
				.filter(device => !device.isLight())
				.map(device => {
					return this.#widgets[this.#widgets.length] = widgetFactory(device, {click: () => { this.device(device); }});
				})
		});
		wrap.append(this.#groups.devices.el);

		wrap.append('<div class="device-control-wrap"></div>');

		this.#room.bind('update', this.updateState, this);
		this.bind('destroy', () => { this.reset(); });

		this.update();
		this.updateState();
	}

	updateState() {
		this.el[this.#room.light_state ? 'addClass' : 'remove']('active');
	}

	update() {
		const wrap = this.el.find('div.device-control-wrap');

		if (this.#device) {
			this.#control = controlFactory(this.#device);
			wrap.html(this.#control.el);
			this.#widgets.forEach((widget) => {
				if (widget.device === this.#device)
					widget.el.addClass('selected');
				else
					widget.el.removeClass('selected');
			});
		} else {
			wrap.html('');
			this.#widgets.forEach((widget) => {
				widget.el.removeClass('selected');
			});
		}
	}

	reset() {
		if (this.#room) {
			this.#room.unbind('update', this.updateState);
		}

		if (this.#control) {
			this.#control.destroy();
			this.#control = null;
		}

		for (let i in this.#groups) {
			this.#groups[i].destroy();
		}

		this.#groups = {};
		this.#widgets = [];
		this.#room = null;
		this.#device = null;
		this.#tabs.deselect();
	}
}
