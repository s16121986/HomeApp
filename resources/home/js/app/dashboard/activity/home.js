import Container from "./container";
import WidgetsGroup from "../widget/group"
import WidgetScenario from "../widget/scenario";
import widgetDevice from "../widget/devices/factory";
import widgetSensor from "../widget/sensors/factory";
import WidgetRoomLight from "../widget/room-light";
import icons from "../../ui/icons";

export default class Home extends Container {
	#tabs;
	#rooms = {};
	#current;

	constructor() {
		super('home');

		/*this.#rooms = {
			home: new RoomHome()
		};

		home().bind('ready', () => {
			home().rooms().forEach(room => {
				this.#rooms[room.key] = new Room(room.key);
			});
		});*/

		/*const self = this;
		this.#tabs = new Tabs(function (key) {
			self.setRoom(key);
		});*/
	}

	init(el) {
		//el.append(this.#tabs.el);
		/*el.append('<div class="header">'
			+ '<div class="spacer"></div>'
			+ '<div class="btn-off">' + icons.powerOff + '</div>'
			+ '</div>');

		el.find('div.btn-off').click(() => { home().command('lightToggle'); });*/

		const lights = new WidgetsGroup({
			title: 'Освещение',
			slider: true,
			widgets: home().rooms().map(room => new WidgetRoomLight(room))
		});
		el.append(lights.el);

		const scenarios = new WidgetsGroup({
			title: 'Сценарии',
			slider: true,
			widgets: home().scenarios().map(scenario => new WidgetScenario(scenario))
		});
		el.append(scenarios.el);

		const favorites = new WidgetsGroup({
			cls: 'devices-group',
			title: 'Избранное',
			slider: true,
			widgets: home().devices()
				.filter(device => device.favorite)
				.map(device => { return widgetDevice(device, {}); })
		});
		el.append(favorites.el);

		let a = [];
		home().sensors()
			//.filter(sensor => sensor.favorite)
			.forEach(sensor => { a[a.length] = widgetSensor(sensor, {}); })
		const sensors = new WidgetsGroup({
			cls: 'devices-group',
			title: 'Датчики',
			slider: true,
			widgets: a
		});
		el.append(sensors.el);
		//const home = new RoomHome();
		//el.find('>div.rooms-wrap').append(home.el);

		//this.setRoom('home');
	}

	setRoom(key) {
		this.#tabs.select(key);
		const room = this.#rooms[key];
		if (!room.isRendered())
			this.el.find('>div.rooms-wrap').append(room.el);
		else
			room.show();

		if (this.#current)
			this.#current.hide();

		this.#current = room;
	}
}
