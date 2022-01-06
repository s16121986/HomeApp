import Field from "./field";
import UISlider from "../../../ui/slider";

export default class Slider extends Field {
	#slider;

	constructor(key, params) {
		super(key, 'slider', params);
		this.#slider = new UISlider({value: params.value});
		this.el.append(this.#slider.el);
		this.#slider.bind('change', params.change);
	}

	update(value) {
		this.#slider.update(value);
	}
}
