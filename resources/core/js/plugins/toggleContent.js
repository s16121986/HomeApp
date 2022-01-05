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
	} else
		return $(popup);

	popup.appendTo(options.renderTo || btn.parent());

	return popup;
};

export default function toggleContent(options) {
	options = Object.assign({
		collapsed: false
	}, options);

	const el = $(this);
	const container = (function () {
		if (el.is('.ui-toggle-content'))
			return el;

		const d = $('<div class="ui-toggle-content">'
			+ '<div class="toggle-title"><span>' + (options.title || '') + '</span></div>'
			+ '<div class="toggle-body"></div>'
			+ '</div>');

		d.append(el);

		return d;
	})();

	if (options.collapsed)
		container.addClass('collapsed');

	container.find('>div.toggle-title').click(function () {
		container.toggleClass('collapsed');
	});
}
