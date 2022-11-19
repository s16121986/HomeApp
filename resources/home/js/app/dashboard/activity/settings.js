import Container from "./container";
import Toggle from "../widget/toggle";
import Group from "../widget/group";

export default class Settings extends Container {
	constructor() {
		super('settings');

		/*const self = this;
		this.#tabs = new Tabs(function (key) {
			self.setRoom(key);
		});*/
	}

	init(el) {
		const settings = home().settings();
		const widgets = [];
		const toggleWidgetFactory = (name, title) => {
			return new Toggle(name, {
				title: title,
				checked: settings.get(name),
				change: () => {
					home().command('changeSettings', {
						name: name,
						value: !settings.get(name)
					})
				}
			});
		};
		const updateEvents = () => {
			const flag = settings.get('events');
			widgets[1].setDisabled(!flag);
			widgets[2].setDisabled(!flag);
			widgets[3].setDisabled(!flag);
		};
		widgets.push(toggleWidgetFactory('events', 'Все события'));
		widgets.push(toggleWidgetFactory('events.buttons', 'Выключатели'));
		widgets.push(toggleWidgetFactory('events.motions', 'Датчики движения'));
		widgets.push(toggleWidgetFactory('events.cron', 'Расписание (Cron)'));

		const group = new Group({
			title: 'События',
			widgets: [
				widgets[0],
				widgets[1],
				widgets[2],
				widgets[3],
			]
		});

		el.append(group.el);
		//widgets.forEach(w => { el.append(w.el); });

		home().settings().bind('change', (name, flag) => {
			if (name === 'events')
				updateEvents();
			widgets.find(w => w.id === name).setChecked(flag);
		});

		updateEvents();

		//el.append(this.#tabs.el);
		//const wrap = el.append('<div class="rooms-wrap"></div>');

		//el.append(rooms.el);
		//el.find('>div.rooms-wrap').append(home.el);

		//this.setRoom('home');
	}
}
