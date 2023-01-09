import "../main"
import Client from "../../plugins/modbus/client";

$(document).ready(function () {
	const meta = document.head.querySelector('meta[name="modules"]');

	new Client({
		container: $('#modbus-client'),
		modules: JSON.parse(meta.content)
	});
});
