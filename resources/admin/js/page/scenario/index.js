import "../main"

$(document).ready(function () {
	(function (table) {
		const toggleDecorator = function (url) {
			return function (e) {
				if ($(this).hasClass('disabled'))
					return;

				const el = $(this)
					.addClass('disabled')
					.toggleClass('on');

				Http.getJSON('/scenario/' + el.data('id') + '/update?action=' + url, function () {
					el.removeClass('disabled');
				});
			};
		};

		table.find('tr.item').each(function () {
			const tr = $(this);
			const id = tr.data('id');

			tr.find('td.column-enabled div.toggle')
				.data('id', id)
				.click(toggleDecorator('enabled'));
		});
	})($('#table-scenarios'));
});
