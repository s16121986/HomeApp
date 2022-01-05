export default (function () {

	const rangeFromString = function (string) {
		let from = new Date();
		let to = new Date();
		switch (string) {
			case 'all':
				return [null, null];
			case 'today':
				return [from, to];
			case 'yesterday':
				from.setDate(from.getDate() - 1);
				to.setDate(from.getDate());
				return [from, to];
			case 'last7days':
				from.setDate(from.getDate() - 7);
				return [from, to];
			case 'last14days':
				from.setDate(from.getDate() - 14);
				return [from, to];
			case 'last30days':
				from.setDate(from.getDate() - 30);
				return [from, to];
			case 'thisyear':
				from.setMonth(0);
				from.setDate(1);
				to.setMonth(11);
				to.setDate(31);
				return [from, to];
			case 'prevyear':
				from.setYear(from.getYear() - 1);
				to.setYear(from.getYear());
				from.setMonth(0);
				from.setDate(1);
				to.setMonth(11);
				to.setDate(31);
				return [from, to];
			case 'thismonth':
				from.setDate(1);
				to.setMonth(to.getMonth() + 1);
				to.setDate(0);
				return [from, to];
			case 'prevmonth':
				from.setMonth(from.getMonth() - 1);
				from.setDate(1);
				to.setDate(0);
				return [from, to];
			case 'nextmonth':
				from.setMonth(from.getMonth() + 1);
				from.setDate(1);
				to.setMonth(from.getMonth() + 1, 0);
				return [from, to];
			case 'thisweek':
				(function () {
					let d = from.getDay();
					if (d !== 1)
						from.setDate(from.getDate() - d + 1);
					to.setMonth(from.getMonth(), from.getDate() + 6);
				})();
				return [from, to];
			case 'prevweek':
				(function () {
					let d = from.getDay();
					from.setDate(from.getDate() - d + 1 - 7);
					to.setMonth(from.getMonth(), from.getDate() + 6);
				})();
				return [from, to];
			case 'nextweek':
				(function () {
					let d = from.getDay();
					from.setDate(from.getDate() - d + 1 + 7);
					to.setMonth(from.getMonth(), from.getDate() + 6);
				})();
				return [from, to];
		}
		return null;
	};

	class DateRange {
		#from;
		#to;

		constructor(dateStart, dateEnd) {

			this.#from = dateStart ? Date.factory(dateStart) : null;
			this.#to = dateEnd ? Date.factory(dateEnd) : null;
			this._validate();
		}

		_validate() {
			if (!this.#from || !this.#to)
				return;
			if (this.#from.getTime() > this.#to.getTime())
				this.#to = this.#from.clone();
		}

		get from() { return this.#from; }

		get to() { return this.#to; }

		clone() { return new DateRange(this.#from, this.#to); }

		fromString(string) {
			let dates = rangeFromString(string);
			if (dates) {
				this.#from = dates[0] ? dates[0] : null;
				this.#to = dates[1] ? dates[1] : null;
			} else {
				dates = string.split(' - ');
				this.#from = dates[0] ? Date.factory(dates[0]) : null;
				this.#to = dates[1] ? Date.factory(dates[1]) : null;
			}
			this._validate();
		}

		clear() {
			this.#from = null;
			this.#to = null;
			return this;
		}

		setFrom(date) {
			this.#from = date === null ? null : Date.factory(date);
			this._validate();
			return this;
		}

		setTo(date) {
			this.#to = date === null ? null : Date.factory(date);
			this._validate();
			return this;
		}

		getDates() {
			if (!this.#from || !this.#to)
				return [];

			const date = this.#from.clone();
			const dateEndString = this.#to.format('Y-m-d');
			let dates = [date.clone()];

			while (date.format('Y-m-d') !== dateEndString) {
				date.modify('+1 day');
				dates[dates.length] = date.clone();
			}

			return dates;
		}

		format(format) {
			if (!this.#from && !this.#to)
				return '';
			return (this.#from ? this.#from.format(format) : '')
				+ ' - ' + (this.#to ? this.#to.format(format) : '');
		}

		toString() { return this.format(); }
	}

	return DateRange;

})();
