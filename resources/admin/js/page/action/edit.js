import "../main"

import "../../app/actions/app";
import EntityField from "../../app/actions/field/entity";

$(document).ready(function () {
	const eventField = $('#form_data_event');
	const parentField = new EntityField('parent');
	//const entityField = new EntityField('entity');

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
});
