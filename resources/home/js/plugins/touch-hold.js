$.fn.touchHold = function (options) {
	options = $.extend({
		timeout: 800
	}, options);

	let event;
	let el;
	let timer;
	let holdFlag = false;

	const onlongtouch = function () {
		timer = null;
		holdFlag = true;
		el.trigger('touchhold');
		el = null;
	};
	const touchstart = function (e) {
		//e.stopPropagation();
		//e.preventDefault();
		el = $(this);
		event = e;

		$(document.body)
			.bind('touchend', touchend)
			.bind('mouseup', touchend);

		holdFlag = false;

		if (timer)
			clearTimeout(timer);

		timer = setTimeout(onlongtouch, options.timeout);
	};
	const touchend = function (e) {
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
		el = null;
		$(document.body)
			.unbind('touchend', touchend)
			.unbind('mouseup', touchend);

		if (holdFlag) {
			e.preventDefault();
			e.stopPropagation();
			e.cancelBubble = true;
			e.returnValue = false;
			//holdFlag = false;
		}
		//e.returnValue = false;
		//return false;
	};
	const click = function (e) {
		if (holdFlag)
			e.stopImmediatePropagation();
	};

	return $(this).each(function () {
		$(this)
			.bind('click', click)
			.bind('mousedown', touchstart)
			.bind('touchstart', touchstart)
		;
	});
};