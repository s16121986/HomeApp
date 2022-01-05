import {ondocumentclick} from "../core"

const popupFactory = function (btn, options) {
	let popup = options.popup;
	if (is_function(popup))
		popup = popup();
	else if (options.url) {
		popup = $('<div class="ui-popup ' + options.cls + ' loading"></div>');
		Http.get(options.url, function (html) {
			popup.html(html).removeClass('loading');
		});
	} else if (is_string(popup))
		popup = $(popup);
	else
		return $(popup);

	popup.appendTo(options.renderTo || btn.parent());

	return popup;
};

export default function buttonPopup(options) {
	const btn = $(this);
	let popup;
	let ondc;

	options = Object.assign({
		show: function () { popup.show(); },
		hide: function () { popup.hide(); }
	}, options);

	const show = function () {
		options.show();
		$(document).click(ondc);
	};

	const hide = function () {
		options.hide();
		$(document).unbind('click', ondc);
	};

	const onclick = function (e) {
		e.preventDefault();
		e.stopPropagation();

		if (popup.is(':hidden'))
			show();
		else
			hide();
	};

	btn.one('click', function (e) {
		e.stopPropagation();
		popup = popupFactory(btn, options);
		btn.click(onclick);
		ondc = ondocumentclick(popup, hide);
		show();
	});
}
