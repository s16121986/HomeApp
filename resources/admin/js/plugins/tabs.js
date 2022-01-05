$.fn.tabs = function (options) {
	if (typeof (options) === 'function')
		options = {change: options};

	options = $.extend({
		hash: true,
		unselectable: false,
		autoselect: true,
		currentClass: 'current',
		change: EmptyFn
	}, options);

	const nav = $(this).bind('change', options.change);
	const navItems = nav.children('div');

	(function () {
		if (!options.hash)
			return;

		let i = 0;
		navItems.each(function () {
			$(this).data('hash', i++ === 0 ? '' : $(this).data('id'));
		});
	})();

	const select = function () {
		const navTab = $(this);

		if (navTab.hasClass(options.currentClass)) {
			if (options.unselectable) {
				navTab.removeClass(options.currentClass);
				nav.trigger('change', undefined);
			}
			return;
		}

		navItems.filter('.' + options.currentClass)
			.removeClass(options.currentClass);

		navTab.addClass(options.currentClass);

		if (options.hash) {
			const hash = navTab.data('hash');
			if (hash)
				history.replaceState(null, null, location.pathname + location.search + '#!' + hash);
			else if (location.hash)
				history.replaceState(null, null, location.pathname + location.search);
		}

		nav.trigger('change', navTab.data('id'));
	};
	const initCurrent = function () {
		if (options.hash && location.hash) {
			const hash = location.hash.replace(/^[#!]+/, '');
			navItems.each(function () {
				if ($(this).data('hash') === hash) {
					$(this).click();
					return false;
				}
			});
		} else if (options.autoselect)
			navItems.eq(0).click();
	};

	navItems.click(select);

	initCurrent();

	const cur = navItems.filter('.current');
	if (options.autoselect && !cur.length)
		navItems.eq(0).click();

	if (options.hash)
		window.addEventListener("popstate", initCurrent);

	return nav;
};