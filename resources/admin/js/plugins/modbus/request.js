export default class Request {
	constructor(client) {
		this.client = client;

		this.command = (function () {
			const paramsCode = function (params) {
				let args = [];
				params.forEach(p => {
					const code = p.getCode();
					if (!code)
						return;
					args.push(code);
				});
				return args.join(' ');
			};

			return 'modbus_client -mrtu '
				+ paramsCode(client.getPortParams())
				+ ' /dev/RS485 '
				+ paramsCode(client.getRequestParams());
			//--debug -b9600 -d8 -pnone -s1 /dev/RS485 -a72 -t0x05 -r0 0x0
		})();
	}

	getCommand() { return this.command; }

	send(callback) {
		$.ajax({
			url: '/debug/modbus',
			method: 'post',
			dataType: 'json',
			data: {
				command: this.command
			},
			success: callback
		});
	}
}
