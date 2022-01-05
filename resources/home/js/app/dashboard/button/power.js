import Button from "./button";
import icons from "../../ui/icons";

export default class Power extends Button {
	constructor(params) {
		super(Object.assign({
			cls: 'power-off' + (params.state ? ' active' : ''),
			icon: icons.powerOff,
			text: ''
		}, params));
	}

	update(state) {
		this.state = state;
		if (state)
			this.el.addClass('active');
		else
			this.el.removeClass('active');
	}
}
