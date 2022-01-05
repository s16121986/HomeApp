import Window from "./window.js"

const windowFn = {
	WindowDialog: function (params) {
		if (is_string(params))
			params = {url: params};

		const w = new Window(params);
		w.show();
		return w;
	},
	MessageConfirm: function (message, title, fn) {
		if (typeof message === 'string')
			message = {
				title: title,
				html: message,
				cls: 'window-message window-confirm'
			};
		new Window($.extend({
			title: '{{langesc:Message}}',
			cls: 'window-message',
			buttons: ['ok', 'cancel']
		}, message));
	},
	MessageBox: function (message, title, type) {
		if (typeof message === 'string')
			message = {
				title: title || '{{langesc:Message}}',
				html: message,
				cls: 'window-message' + (type ? ' window-' + type : '')
			};
		new Window($.extend({
			title: '{{langesc:Message}}',
			cls: 'window-message',
			buttons: ['ok']
		}, message));
	}
};

Object.assign(window, windowFn);

export {Window};
