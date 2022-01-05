import Container from "./container";
//import WidgetRoom from "../widget/sensor";

export default class Sensors extends Container {
	constructor() {
		super('sensors');

		/*const self = this;
		this.#tabs = new Tabs(function (key) {
			self.setRoom(key);
		});*/
	}

	init(el) {
		//el.append(this.#tabs.el);
		//const wrap = el.append('<div class="rooms-wrap"></div>');

		//el.append(rooms.el);
		//el.find('>div.rooms-wrap').append(home.el);

		//this.setRoom('home');
	}
}
