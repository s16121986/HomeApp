function getX(e) {
	if (e.which === 1)
		return e.pageX;
	else
		return e.pageX || e.originalEvent.targetTouches[0].pageX;
}

$.fn.touchSlider = function (options) {
	options = $.extend({
		item: 'a'
	}, options);

	const el = $(this);
	let pos = {margin: 0, x: 0};

	el.css({overflow: 'hidden'});

	const needWrap = function () {
		const W = el.outerWidth();
		let w = 0;
		el.find(options.item).each(function () { w += $(this).outerWidth(true); });

		return W < w;
	};

	const scroll = function (e, animate) {
		const s = el.scrollLeft();
		if (s === 0)
			return;

		if (!needWrap()) {
			el.scrollLeft(0);
			pos.margin = 0;
			return;
		}

		const w = el.find(options.item).eq(0).outerWidth(true);
		const m = s % w;
		if (m === 0)
			return;

		const l = (() => {
			if (m < 20)
				return Math.floor(s / w) * w;
			else
				return Math.ceil(s / w) * w;
		})();

		el.animate({scrollLeft: l});
		pos.margin = l;
	};

	const resize = function () {
		/*const W = el.outerWidth();
		const ow = items.eq(0).outerWidth(true);
		const w = items.eq(0).outerWidth();

		items.width();*/

		scroll();
	};

	const move = function (e) {
		pos.x = pos.start - getX(e);
		//tab.css('margin-left', pos.x);
		el.scrollLeft(pos.x + pos.margin);
	};

	const end = function (e) {
		if (pos.x !== 0) {
			pos.margin = el.scrollLeft();
		}
		e.stopPropagation();
		e.stopImmediatePropagation();
		scroll(e, true);
		//$(document.body).removeClass('unselectable');
		$(document).unbind('touchmove mousemove', move);
		$(document).unbind('touchend mouseup', end);
		//el.trigger('gallery-scroll');
	};

	el.bind('touchstart mousedown', function (e) {
		if (!needWrap()) return;
		pos.x = 0;
		pos.start = getX(e);
		e.stopPropagation();
		e.stopImmediatePropagation();
		//$(document.body).addClass('unselectable');
		$(document).bind('touchmove mousemove', move);
		$(document).bind('touchend mouseup', end);
	});

	//el.bind('update', scroll);
	resize();
	$(window).resize(resize);
	if ('onorientationchange' in window) {
		window.addEventListener('orientationchange', resize, false);
	}

	return el;
};
