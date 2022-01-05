import {
	DateRange,
	Http,
	KeyCodes,
	Timeout,
	EventsTrait,
	Window
} from "@core.main"

Object.assign(window, {
	DateRange: DateRange,
	Timeout: Timeout,
	Http: Http,
	KeyCodes: KeyCodes,
	Window: Window
});

import "../vendor/jquery.sortElements"
import "../plugins/tabs"
import "../plugins/tabs-filter"

$(document).ready(function () {
	return;
	(function () {
		const item = function (params) {
			return '<a class="' + params.cls + '" href="' + (params.url || ('/account/' + params.cls)) + '">'
				+ '<i class="icon-' + (params.icon || params.cls) + '"></i>'
				+ params.text + '</a>';
		};
		let menu = '<div class="ui-popup menu">';
		menu += item({cls: 'settings', text: 'Настройка'});
		menu += '<hr />';
		menu += item({cls: 'logout', text: 'Выход'});
		menu += '';
		menu += '</div>';
		$('#user-btn').buttonPopup({
			popup: menu,
			cls: 'user-popup'
		});
	})();

	(function () {
		const sidebar = $('section.sidebar');

		sidebar.find('div.label').click(function () { $(this).parent().toggleClass('expanded'); });
		sidebar.find('a.current').parent().parent().addClass('expanded');

		$(window).scroll(function () {
			const y = $(this).scrollTop();
			sidebar.css('padding-top', (y > 56 ? 0 : 56 - y));
		});
	})();

	(function () {
		const wrap = $('#menu-actions');
		if (0 === wrap.length)
			return;

		wrap.find('div.btn-menu').buttonPopup({popup: wrap.find('nav')});
	})();

	const input = $('#global-search-input');
	input
		.groupcomplete({
			groups: {
				customer: 'Пользователи',
				master: 'Мастера',
				request: 'Заявки'
			},
			source: '/search',
			select: function (e, ui) {
				location = '/' + ui.item.group + '/' + ui.item.value;
			}
		})
		.focus(function () {
			if (input.val() !== '')
				input.groupcomplete('search');
		});

	$('select[multiple]').multiselect();

	$('input[type="file"]').fileupload();
});

//import("./page/auth.js");
