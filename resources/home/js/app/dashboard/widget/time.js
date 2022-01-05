import Container from "./container";

const monthNames = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
//const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export default class Time extends Container {
	constructor() {
		super('time');
	}

	init(el, body) {
		body.append('<div class="time"></div>'
			+ '<div class="date"></div>');

		let flag = true;
		const dateEl = body.find('div.date');
		const timeEl = body.find('div.time');
		const update = function () {
			const now = new Date();
			let s = [];
			s[0] = str_pad(now.getHours(), 2, '0');
			s[1] = str_pad(now.getMinutes(), 2, '0');
			//s[2] = str_pad(now.getSeconds(), 2, '0');
			dateEl.html(
				dayNames[now.getDay()] + ', '
				+ now.getDate()
				+ ' ' + monthNames[now.getMonth()]);
			timeEl.html(s.join('<span>' + (flag ? ':' : ' ') + '</span>'));
			flag = !flag;
		};

		setInterval(update, 1000);

		update();
	}
}
