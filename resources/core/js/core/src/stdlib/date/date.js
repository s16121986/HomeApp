(function () {

	Date.dayNames = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресение'];
	Date.dayNamesShort = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
	Date.monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
	Date.monthNamesShort = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
	Date.firstDayOfWeek = 1; //monday

	const defaultFormats = {
		date: 'd.m.Y',
		time: 'H:i',
		datetime: 'd.m.Y H:i'
	};
	const formatCodes = {
		a: function () { },
		A: function () { },
		d: function () { return str_pad(this.getDate(), 2, '0'); },
		D: function () { return Date.dayNamesShort[this.getDay()]; },
		F: function () { return Date.monthNames[this.getMonth()]; },
		g: function () { return this.getHours() > 12 ? this.getHours() - 12 : this.getHours(); },
		G: function () { return this.getHours(); },
		h: function () { return str_pad(this.getHours() > 12 ? this.getHours - 12 : this.getHours(), 2, '0'); },
		H: function () { return str_pad(this.getHours(), 2, '0'); },
		i: function () { return str_pad(this.getMinutes(), 2, '0'); },
		I: function () { return false; },
		j: function () { return this.getDate(); },
		l: function () { return Date.dayNames[this.getDay()]; },
		L: function () { return this.isLeapYear(); },
		m: function () { return str_pad(this.getMonth() + 1, 2, '0'); },
		M: function () { return Date.monthNamesShort[this.getMonth()]; },
		n: function () { return (this.getMonth() + 1); },
		O: function () { return this.getTimezoneOffset(); },
		s: function () { return str_pad(this.getSeconds(), 2, '0'); },
		t: function () { return this.getDaysInMonth(); },
		U: function () { return (this.getTime() / 1000); },
		w: function () { return this.getDay(); },
		W: function () { return this.getWeekOfYear(); },
		Y: function () { return this.getFullYear(); },
		y: function () { return this.getFullYear().substr(2); },
		z: function () { }
	};

	Date.addFormat = function (name, format) { defaultFormats[name] = format; };

	Date.factory = function (dateEntity) {
		if (dateEntity instanceof Date)
			return dateEntity;
		else if (is_string(dateEntity)) {
			if ('' === dateEntity)
				return new Date();
			let date = new Date();
			date.fromString(dateEntity);
			return date;
		} else if (is_number(dateEntity)) {
			let date = new Date();
			date.setTime(dateEntity);
			return date;
		} else if (dateEntity === null)
			return new Date();
		else
			return new Date();
	};

	Date.prototype.format = function (format) {
		if (!format || format === 'ISO')
			return this.getFullYear() + "-"
				+ str_pad(this.getMonth() + 1, 2, '0') + "-"
				+ str_pad(this.getDate(), 2, '0') + "T"
				+ str_pad(this.getHours(), 2, '0') + ":"
				+ str_pad(this.getMinutes(), 2, '0') + ":"
				+ str_pad(this.getSeconds(), 2, '0');

		if (defaultFormats[format])
			format = defaultFormats[format];

		let dateString = '';
		for (let i = 0; i < format.length; i++) {
			if (formatCodes[format[i]])
				dateString += formatCodes[format[i]].call(this).toString();
			else
				dateString += format[i];
		}
		return dateString;
	};

})();

Date.prototype.clone = function () { return new Date(this.getTime()); };
(function () {

	const formats = {
		now: function () { this.setTime(Date.now()); },
		today: function () {
			this.setTime(Date.now());
			this.setHours(0, 0, 0, 0);
		},
		midnight: function () { this.setHours(0, 0, 0, 0); },
		noon: function () { this.setHours(12, 0, 0, 0); },
		yesterday: function () {
			this.setDate(this.getDate() - 1);
			this.setHours(0, 0, 0, 0);
		},
		tomorrow: function () {
			this.setDate(this.getDate() + 1);
			this.setHours(0, 0, 0, 0);
		}
	};
	const getReltext = function (ordinal, currentValue, lastValue) {
		switch (ordinal) {
			case 'this':
				return currentValue;
			case 'previous':
				return currentValue - 1;
			case 'next':
				return currentValue + 1;
			case 'last':
				return lastValue;
		}
	};
	const getOrdinal = function (ordinal, firstValue) {
		switch (ordinal) {
			case 'first':
				return firstValue;
			case 'second':
				return firstValue + 1;
			case 'third':
				return firstValue + 2;
			case 'fourth':
				return firstValue + 3;
			case 'fifth':
				return firstValue + 4;
			case 'sixth':
				return firstValue + 5;
			case 'seventh':
				return firstValue + 6;
			case 'eighth':
				return firstValue + 7;
			case 'ninth':
				return firstValue + 8;
			case 'tenth':
				return firstValue + 9;
			case 'eleventh':
				return firstValue + 10;
			case 'twelfth':
				return firstValue + 11;
		}
		return false;
	};
	const handlers = {
		setYear: function (ordinal) {
			switch (ordinal) {
				case 'this':
					return true;
				case 'previous':
					this.setFullYear(this.getFullYear() - 1);
					return true;
				case 'next':
					this.setFullYear(this.getFullYear() + 1);
					return true;
			}
			return false;
		},
		setMonth: function (ordinal) {
			let m = getReltext(ordinal, this.getMonth(), 11) || getOrdinal(ordinal, 0);
			if (false === m)
				return false;

			this.setMonth(m);
			return true;
		},
		setDate: function (ordinal, rootUnit) {
			let d1 = getReltext(ordinal, this.getDate(), this.getDaysInMonth());
			let d2 = getOrdinal(ordinal, 1);
			if (false === d1 && false === d2)
				return false;

			if (rootUnit === 'year') {
				switch (true) {
					case false !== d2:
						handlers.setMonth.call(this, 'first');
						break;
					case ordinal === 'last':
						handlers.setMonth.call(this, 'last');
						break;
				}
			}

			this.setDate(d1 || d2);
			return true;
		}
	};
	const unitHandler = function (unit, ordinal, rootUnit) { //порядковые числительные и указатели

		//if (formats[ordinal]){
		//formats[ordinal].call(this);

		//formats[unit].call(this);
		//return true;
		//}

		switch (unit) {
			case 'day':
				return handlers.setDate.call(this, ordinal, rootUnit);
			case 'month':
				return handlers.setMonth.call(this, ordinal);
			case 'year':
				return handlers.setYear.call(this, ordinal);
			//case 'monday':
		}
		return false;
	};

	Date.prototype.fromString = function (string) {
		if (!is_string(string) || string === '')
			return false;

		if (formats[string])
			return formats[string].call(this);

		let m = string.match(/^(\d{2}).(\d{2}).(\d{4})(.*)/);
		if (m) {
			this.setMonth(Number(m[2]) - 1);
			this.setDate(m[1]);
			this.setFullYear(m[3]);
			return true;
		}

		//first day[ of this month]
		m = string.match(/^(\w+) (\w+)(?: of (\w+) ([a-z0-9]+))?$/);
		if (m) {
			if (m[3])
				unitHandler.call(this, m[4], m[3]);
			unitHandler.call(this, m[2], m[1], m[4]);
			return true;
		}

		let ms = Date.parse(string);
		this.setTime(ms);

		return true;
	};

})();

Date.prototype.modify = function (format) {
	const m = format.match(/^([+-])\s*(\d+)\s*(\w+)$/);
	if (!m)
		return false;
	const i = m[1] === '+' ? +m[2] : -m[2];
	switch (m[3]) {
		case 'second':
		case 'seconds':
			this.setSeconds(this.getSeconds() + i);
			break;
		case 'minute':
		case 'minutes':
			this.setMinutes(this.getMinutes() + i);
			break;
		case 'hour':
		case 'hours':
			this.setHours(this.getHours() + i);
			break;
		case 'day':
		case 'days':
			this.setDate(this.getDate() + i);
			break;
		case 'week':
		case 'weeks':
			this.setDate(this.getDate() + i * 7);
			break;
		case 'month':
		case 'months':
			this.setMonth(this.getMonth() + i);
			break;
		case 'year':
		case 'years':
			this.setFullYear(this.getFullYear() + i);
			break;
	}
	return true;
};

Date.prototype.getYear = function () { return this.getFullYear(); };

Date.prototype.isLeapYear = function () {
	let year = this.getFullYear();
	return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
};

Date.prototype.getDaysInMonth = (function () {
	const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	return function () { // return a closure for efficiency
		let m = this.getMonth();
		return m === 1 && this.isLeapYear() ? 29 : daysInMonth[m];
	};
}());

Date.prototype.getWeekOfYear = (function () {
	// adapted from http://www.merlyn.demon.co.uk/weekcalc.htm
	const ms1d = 864e5, // milliseconds in a day
		ms7d = 7 * ms1d; // milliseconds in a week

	return function () { // return a closure so constants get calculated only once
		let DC3 = Date.UTC(this.getFullYear(), this.getMonth(), this.getDate() + 3) / ms1d, // an Absolute Day Number
			AWN = Math.floor(DC3 / 7), // an Absolute Week Number
			Wyr = new Date(AWN * ms7d).getUTCFullYear();

		return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
	};
}());

Date.prototype.getDayOfYear = function () {
	let num = 0;
	let d = this.clone();
	let m = this.getMonth();
	d.setDate(1);
	d.setMonth(0);
	for (let i = 0; i < m; d.setMonth(++i)) {
		num += this.getDaysInMonth();
	}
	return num + this.getDate() - 1;
};

Date.prototype.isEqual = function (date, format) {
	date = Date.factory(date);
	switch (format) {
		case 'year':
			return date.format('Y') === this.format('Y');
		case 'month':
			return date.format('Ymd') === this.format('Ymd');
		case 'hours':
			return date.format('YmdH') === this.format('YmdH');
		case 'minutes':
			return date.format('YmdHi') === this.format('YmdHi');
		case 'seconds':
			return date.format('YmdHis') === this.format('YmdHis');
		default:
			return date.format('Ymd') === this.format('Ymd');
	}
	return false;
};
Date.prototype.isValid = function () { return !isNaN(this.getTime()); };

Date.prototype.setNow = function () { this.setTime(Date.now()); };

(function () {
	const getDay = Date.prototype.getDay;
	Date.prototype.getDay = function () {
		let day = getDay.call(this);
		return day < Date.firstDayOfWeek ? (8 - Date.firstDayOfWeek + day) : day;
	};
})();
