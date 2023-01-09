import AbstractParam from "./AbstractParam";

export default class Data extends AbstractParam {
	constructor() {
		super('data', {
			label: 'Данные',
			placeholder: '0x0000'
		});
	}

	getCode() { return this.getValue(); }
}
