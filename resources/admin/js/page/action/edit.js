import "../main"

class EventValue {

}

import "../../app/actions/app";
import Command from "../../app/actions/command";
import ParentField from "../../app/actions/field/parent";
import EntityField from "../../app/actions/field/entity";

$(document).ready(function () {
	const tabs = $('#action-form').find('.tab');
	$('#tabs').tabs(function (e, id) {
		tabs.hide();
		tabs.filter('#' + id).show();
	});

	const eventField = $('#form_data_event');
	const parentField = new EntityField('parent');
	const entityField = new EntityField('entity');

	eventField.change(function () {
		return;
		const event = $(this).val();

		parentField.reset();

		if (!event) {
			parentField.hide();
			return;
		}

		switch (event) {
			case 'App\\Events\\Home\\Sunrise':
			case 'App\\Events\\Home\\Nightfall':
				parentField.hide();
				break;
			case 'App\\Events\\Home\\ScenarioSelected':
				parentField.load('scenarios', 'Сценарий');
				break;
			case 'App\\Events\\Room\\StateChanged':
				parentField.load('rooms', 'Комната');
				break;
			default:
				parentField.load('devices', 'Устройство');
		}
	}).change();

	((el) => {
		return;
		const wrap = $('<div class=""></div>').appendTo(el);
		$('<div class="">add</div>')
			.click(() => {
				const command = new Command();
				wrap.append(command.el);
			})
			.appendTo(el);
	})($('#tab-commands'));
});
