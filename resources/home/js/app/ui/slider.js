import {EventsTrait} from "@core.main";
import Device from "../models/device";

export default class Slider {
	#el;
	#sliderEl;

	constructor(options) {
		this.value = options.value;
	}

	update(v) {
		if (v === this.value)
			return;

		if (v < 5)
			v = 5;
		else if (v % 5)
			v -= v % 5;

		//update(v);
		this.value = v;

		const p = 100 * (v - 5) / 95;
		if (!this.#el)
			return;

		this.#sliderEl.find('.ui-slider-range').width(p + '%');
		this.#sliderEl.find('.ui-slider-handle').css('left', p + '%');
	}

	slide(value) { this.#sliderEl.slider('value', value); }

	get el() {
		if (this.#el)
			return this.#el;

		const self = this;
		const el = $('<div class="ui-control control-slider">'
			+ '<div class="icon off" title="Выкл"></div>'
			+ '<div class="slider"></div>'
			+ '<div class="icon on" title="100%"></div>'
			//+ '<div class="value">100%</div>'
			+ '</div>');

		const point = (p) => {
			$('<div class="point" data-value="' + p + '" title="' + p + '%"></div>')
				.appendTo(el)
				.css({left: (100 * (p - 5) / 95) + '%'});
		};
		//point(0, '<div class="slider-icon"></div>');
		for (let i = 5; i < 100; i += 5) { point(i); }
		point(100, '');

		el.find('div.point')
			.mousedown((e) => { e.stopPropagation(); })
			.click(function () { self.slide(+$(this).data('value')); });

		el.find('div.off').click(() => { this.trigger('change', 0); });
		el.find('div.on').click(() => { this.slide(100); });

		const onchange = (action, ui) => {
			this.value = ui.value;
			this.trigger(action, ui.value);
		};

		this.#sliderEl = el.find('div.slider').slider({
			min: 5,
			max: 100,
			step: 5,
			value: this.value,
			range: 'min',
			slide: (e, ui) => { onchange('slide', ui); },
			change: (e, ui) => { onchange('change', ui); }
		});

		//this.update(value);

		return this.#el = el;
	};

};

Object.assign(Slider.prototype, EventsTrait);
