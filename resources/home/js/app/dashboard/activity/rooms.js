import Container from "./container";
import WidgetRoom from "../widget/room";

export default class Rooms extends Container {
	constructor() {
		super('rooms');

		/*const self = this;
		this.#tabs = new Tabs(function (key) {
			self.setRoom(key);
		});*/
	}

	init(el) {
		//el.append(this.#tabs.el);
		//const wrap = el.append('<div class="rooms-wrap"></div>');
		home().rooms()
			//.filter(room => room.main)
			.forEach(room => {
				const w = new WidgetRoom(room);
				el.append(w.el);
			});
		//el.append(rooms.el);
		//el.find('>div.rooms-wrap').append(home.el);

		//this.setRoom('home');
	}
}
