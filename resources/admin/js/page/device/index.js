import "../main"

$(document).ready(function () {
	(function (table) {
		const popup = {};//new settings.ui.Popup();
		const popupOpen = function (e) {
			e.stopPropagation();
			popup.open($(this).data('id'), {left: e.pageX, top: e.pageY});
		};
		const toggleDecorator = function (url) {
			return function (e) {
				if ($(this).hasClass('disabled'))
					return;

				const el = $(this)
					.addClass('disabled')
					.toggleClass('on');

				Http.getJSON('/device/' + el.data('id') + '/update?action=' + url, function () {
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

			tr.find('td.column-default div.toggle')
				.data('id', id)
				.click(toggleDecorator('default'));

			tr.find('td.column-main div.toggle')
				.data('id', id)
				.click(toggleDecorator('main'));

			tr.find('td.column-favorite div.toggle')
				.data('id', id)
				.click(toggleDecorator('favorite'));

			tr.find('div.icon')
				.data('id', id)
				.click(popupOpen);
		});

		/*popup.getEl()
			.hide()
			.appendTo(table.parent());*/

		table.tabsFilter({
			tabs: [{
				selector: '#module-filter',
				dataIndex: 'module'
			}, {
				selector: '#rooms-filter',
				dataIndex: 'room'
			}, {
				selector: '#group-filter',
				dataIndex: 'group'
			}, {
				selector: '#status-filter',
				dataIndex: 'status',
				default: 'on'
			}]
		});
	})($('#table-devices'));
});
