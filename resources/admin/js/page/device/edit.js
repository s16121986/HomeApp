import "../main"

$(document).ready(function () {
	const modules = [];
	const moduleInput = $('#form_device_module_id');
	const channelInput = $('#form_device_channel').hide();
	const channelField = channelInput.parent();
	const channelSelect = $('<select></select>').appendTo(channelField);
	const value = channelInput.val();

	const getType = function (id) { return modules.find(m => m.id === id).type; };
	const update = function (options) {
		let html = '';
		html += '<option value=""></option>';
		for (const i in options) {
			html += '<option value="' + i + '">' + options[i] + '</option>';
		}
		console.log(Object.keys(options))

		channelField.show();
		channelSelect
			.html(html)
			.val(value);
	};
	const hide = function () {
		channelField.hide();
		channelInput.val('');
	};

	channelSelect.change(function () {
		channelInput.val(this.value);
	});
	moduleInput
		.change(function () {
			const moduleId = $(this).val();
			if (!moduleId)
				return hide();

			const type = getType(+moduleId);

			switch (type) {
				case 21: //ARDUINO_MAIN
					let options = {};
					for (let i = 2; i <= 53; i++) {
						options[i] = 'D' + i;
					}
					for (let i = 0; i <= 15; i++) {
						options[54 + i] = 'A' + i;
					}
					update(options);
					break;
				case 11: //WB_AC_DIMMER
					update({
						0: '1',
						1: '2',
						2: '3'
					});
					break;
				case 12: //WB_LED_DIMMER
					update({
						2: 'B',
						1: 'R',
						0: 'G',
						3: 'W'
					});
					break;
				case 13: //WB_AC_RELAY
					update({
						0: '1',
						1: '2',
						2: '3',
						3: '4',
						4: '5',
						5: '6'
					});
					break;
				case 31: //PROJECTOR_SCREEN
				case 32: //VACUUM_CLEANER
				default:
					hide();
					break;
			}
		}).change();
});
