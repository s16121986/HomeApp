import AbstractParam from "./AbstractParam";

export default class Arg extends AbstractParam {
	constructor(name, params) {
		super(name, params);
	}

	getCode() {
		const v = this.getValue();
		return v ? '-' + this.name + '' + v : '';
	}
}
