export default class Tabs {
	#el;
	#select;

	constructor(select) {
		this.#select = select;
	}

	get el() {
		if (this.#el)
			return this.#el;

		let html = '<div class="home-tabs">';
		//html += '<div data-key="home" class="tab selected">Дом</div>';
		home().rooms().forEach(room => {
			html += '<div data-key="' + room.key + '" class="tab' + (this.#select === room.key ? ' selected' : '') + '">' + room.name + '</div>';
		});
		/*home().rooms().forEach(room => {
			html += '<div data-key="' + room.key + '" class="tab">' + room.name + '</div>'
		});*/
		html += '</div>'

		const self = this;
		const el = $(html);

		el.find('div').click(function () {
			const room = home().room($(this).data('key'));
			dashboard().roomSidebar.room(room);
		});

		return this.#el = el;
	}

	select(key) {
		this.el.find('div').each(function () {
			if ($(this).data('key') === key)
				$(this).addClass('selected');
			else
				$(this).removeClass('selected');
		});
	}

	deselect() {
		this.el.find('div.selected').removeClass('selected');
	}
}
