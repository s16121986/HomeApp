$.fn.tabsFilter = function (options) {
	options = $.extend({
		itemSelector: 'tr.item'
	}, options);

	const table = $(this);
	let currentFilters = {};

	const altRows = function () {
		let i = 0;
		table.find(options.itemSelector).each(function () {
			if (!$(this).is(':hidden'))
				$(this)[i++ % 2 ? 'removeClass' : 'addClass']('over');
		});
	};
	const refresh = function () {
		let i = 0;
		table.find(options.itemSelector).each(function () {
			const tr = $(this);
			let flag = true;
			for (let k in currentFilters) {
				if (tr.data(k) === currentFilters[k])
					continue;
				flag = false;
				break;
			}

			if (flag) {
				tr.show();
				tr[i++ % 2 ? 'removeClass' : 'addClass']('over');
			} else
				tr.hide();
		});
	};
	const set = function (dataIndex, id) {
		if (id)
			currentFilters[dataIndex] = id;
		else
			delete currentFilters[dataIndex];
		refresh();
	};
	const toNumber = function (s) {
		if (/\d+/.test(s))
			return parseInt(s);
		else
			return -1;
	};

	options.tabs.forEach(r => {
		$(r.selector).tabs({
			autoselect: false,
			unselectable: true,
			hash: false,
			change: function (e, id) { set(r.dataIndex, id); }
		});

		if (r.default) {
			currentFilters[r.dataIndex] = r.default;
			$(r.selector).children('div')
				.filter(function () { return $(this).data('id') === r.default; })
				.addClass('current');
		}
	});

	table.find('th')
		.filter(function () { return !!$(this).data('sort'); })
		.each(function () { $(this).addClass('sortable'); })
		.click(function () {
			const th = $(this);
			const columnCls = th.data('sort');
			const inverse = th.hasClass('asc');
			const inverseInc = inverse ? -1 : 1;
			const sortFn = (function () {
				switch (th.data('type')) {
					case 'number':
						return function (a, b) {
							const nA = toNumber($.text([a]));
							const nB = toNumber($.text([b]));

							if (nA === nB)
								return 0;

							return nA > nB ? inverseInc : -inverseInc;
						};
					default:
						return function (a, b) {
							if ($.text([a]) == $.text([b]))
								return 0;

							return $.text([a]) > $.text([b]) ? inverseInc : -inverseInc;
						};
				}
			})();

			table.find('th.sort').attr('class', '');
			th
				.addClass('sortable sort')
				.addClass(inverse ? 'desc' : 'asc');

			table.find('td.' + columnCls).sortElements(sortFn, function () {
				// parentNode is the element we want to move
				return this.parentNode;
			});

			altRows();
		});

	for (let i in currentFilters) {
		refresh();
		break;
	}

	altRows();

	return table;
};