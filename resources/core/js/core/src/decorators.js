export function ondocumentclick(el, fn) {
	return function (e) {
		if (el.is(e.target) || el.find(e.target).length)
			return;
		fn(e);
	};
}

export function setLoading(el) {
	return function (flag) {
		el[flag ? 'addClass' : 'removeClass']('loading');
		return this;
	};
}
