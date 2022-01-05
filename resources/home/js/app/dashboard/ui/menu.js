import icons from "../../ui/icons";

export default class Menu {
	#el;
	#menu;

	get el() {
		if (this.#el)
			return this.#el;

		const icon = function (n) {
			return '<img src="/images/ui/16/' + n + '.png" />';
		};
		let html = '<nav class="main-menu">';
		html += '<div data-id="home" class="a home">' + icons.home + '</div>';
		html += '<div data-id="rooms" class="a rooms">' + icon('room') + '</div>';
		//html += '<button class="power-off"><div class="wrap">' + icons.powerOff + '</div></button>';
		html += '<div data-id="sensors" class="a sensors">' + icon('thermometer') + '</div>';
		//html += '<div data-id="settings" class="settings">' + icons.settings + '</div>';
		html += '<div data-id="menu" class="menu">' + icons.menu + '</div>';
		html += '</div>';

		const el = $(html);

		//el.find('button').click(e => { home().command('lightToggle'); });
		el.find('div.a').click(function () { dashboard().activity($(this).data('id')); });
		el.find('div.menu').click((e) => {
			e.stopPropagation();
			this.menu();
		});

		return this.#el = el;
	}

	current(id) {
		this.el.find('div.current').removeClass('current');
		this.el.find('div.' + id).addClass('current');
	}

	menu() {
		if (!this.#menu) {
			let html = '<div class="settings-menu">';
			html += '<a href="#" class="">' + icons.powerOff + 'Выключить свет</a>';
			html += '<div class="separator"></div>';
			html += '<a href="http://admin.smart.home" target="_blank" class="">' + icons.settings + 'Настройки</a>';
			html += '</div>';
			this.#menu = $(html).appendTo(document.body);
			this.#menu._odc = (e) => {
				//if (this.#menu.is(e.target) || this.#menu.find(e.target).length)
				//	return;
				this.#menu.hide();
				$(document).unbind('click', this.#menu._odc);
			};
		}
		this.#menu.show();

		$(document).click(this.#menu._odc);
	}
}
