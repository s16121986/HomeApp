import Container from "./container";
import WidgetsGroup from "../../../widget/group"
import WidgetRoom from "../../../widget/room";

export default class Home extends Container {
	constructor() {
		super('home');
	}

	init(el) {
		const rooms = new WidgetsGroup({
			widgets: home().rooms()
				//.filter(room => room.main)
				.map(room => new WidgetRoom(room))
		});
		el.append(rooms.el);
	}
}
