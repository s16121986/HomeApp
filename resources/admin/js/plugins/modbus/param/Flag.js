import AbstractParam from "./AbstractParam";

export default class Flag extends AbstractParam {

	isChecked() { return this.getInputEl().is(':checked'); }

	createInputEl() { return $('<input type="checkbox" checked="checked" />'); }

	getCode() { return this.isChecked() ? '--' + this.name : ''; }
}
