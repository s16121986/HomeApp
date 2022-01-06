import "../main"

import "../../app/actions/app"
import CommandWindow from "../../app/actions/widnow/command";
import ConditionWindow from "../../app/actions/widnow/condition";

$(document).ready(function () {
	const id = +app().get('id');

	$('#btn-condition-add').click((e) => {
		e.preventDefault();
		(new ConditionWindow(id, 'new')).show();
	});

	$('#conditions-table').find('td.column-edit a').click(function (e) {
		e.preventDefault();
		(new ConditionWindow(id, $(this).data('id'))).show();
	});

	$('#btn-command-add').click((e) => {
		e.preventDefault();
		(new CommandWindow(id, 'new')).show();
	});

	$('#commands-table').find('td.column-edit a').click(function (e) {
		e.preventDefault();
		(new CommandWindow(id, $(this).data('id'))).show();
	});
});
