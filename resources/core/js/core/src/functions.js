const isTypeFn = {
	is_date: function (value) { return toString.call(value) === '[object Date]'; },

	is_array: ('isArray' in Array) ? Array.isArray : function (value) { return toString.call(value) === '[object Array]'; },

	is_object: (toString.call(null) === '[object Object]') ?
		function (value) {
			return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
		} : function (value) {
			return toString.call(value) === '[object Object]';
		},

	is_function:
		(typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function (value) {
			return !!value && toString.call(value) === '[object Function]';
		} : function (value) {
			return !!value && typeof value === 'function';
		},

	is_simple_object: function (value) { return value instanceof Object && value.constructor === Object; },

	is_scalar: function (value) {
		const type = typeof value;

		return type === 'string' || type === 'number' || type === 'boolean';
	},

	is_number: function (value) { return typeof value === 'number' && isFinite(value); },

	is_numeric: function (value) { return !isNaN(parseFloat(value)) && isFinite(value); },

	is_string: function (value) { return typeof value === 'string'; },

	is_boolean: function (value) { return typeof value === 'boolean'; },

	is_empty: function (value, allowEmptyString) {
		return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (this.is_array(value) && value.length === 0);
	}
};

const coreFn = {
	EmptyFn: function () {},

	in_array: function (value, array) { return array.find(v => v === value) ? true : false; },

	str_pad: function (input, length, pad_string, options) {
		input = input.toString();
		if (input.length >= length)
			return input;

		let s = [];
		const l = length - input.length;
		for (let i = 0; i < l; i++) {
			s[s.length] = pad_string;
		}
		input = s.join('') + input;

		return input;
	},

	ucfirst: function (str) { return str[0].toUpperCase() + str.substring(1, str.length); },

	explode: function (delimiter, string) { return string.toString().split(delimiter.toString()); },

	htmlspecialchars: function (text) {
		if (!text)
			return '';
		const map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, function (m) { return map[m]; });
	},

	getWordDeclension: function (number, variants) {
		number = Math.abs(number);
		let i;
		switch (true) {
			case (number % 100 == 1 || (number % 100 > 20) && (number % 10 == 1)):
				i = 0;
				break;
			case (number % 100 == 2 || (number % 100 > 20) && (number % 10 == 2)):
			case (number % 100 == 3 || (number % 100 > 20) && (number % 10 == 3)):
			case (number % 100 == 4 || (number % 100 > 20) && (number % 10 == 4)):
				i = 1;
				break;
			default:
				i = 2;
		}
		if (typeof (variants) === 'string')
			variants = variants.split(',');

		return variants[i] || null;
	},

	call_user_func: function (callable, arg) {
		if (isTypeFn.is_function(callable)) {
			return callable(arg);
		} else if (isTypeFn.is_array(callable)) {
			const s = callable[0].split('.');
			const l = s.length;
			let h = window;
			for (let i = 0; i < l; i++) {
				if (!h[s[i]])
					return;
				h = h[s[i]];
			}
			if (isTypeFn.is_function(h))
				return h(callable[1] || arg);
		}
	},

	now: function () {
		return new Date();
	}
};

const hashFn = {
	rand: function (min, max) {
		return min + Math.round((max - min) * Math.random());
	},

	generateHash: function (length) {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
		const l = chars.length - 1;
		let hash = '';
		for (let i = 0; i < length; i++) {
			hash += chars.substr(this.rand(0, l), 1);
		}
		return hash;
	}
};

Object.assign(window, isTypeFn, coreFn, hashFn);
