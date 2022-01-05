import Container from "./container";

export default class RoomLight extends Container {
	#room;

	constructor(room, params) {
		super(room.key, {
			cls: 'widget-room room-light room-' + room.key,
			//title: '&nbsp;'
		});

		this.#room = room;
	}

	get room() { return this.#room; }

	get key() { return this.#room.key; }

	init(el, body) {
		this.#room.bind('update', () => {
			if (this.#room.light_state)
				this.el.addClass('active');
			else
				this.el.removeClass('active');
		});

		if (this.#room.light_state)
			this.el.addClass('active');

		let html = '';
		html += '<div class="ui-switch"></div>';
		html += '<div class="name">' + this.#room.name + '</div>';

		body.append(html);
	}

	click() {
		this.#room.command('lightToggle');
	}
}
