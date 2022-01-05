import Response from "./response.js"

export default class Request {
	#params;

	constructor(params) {
		this.#params = params;
	}

	async send() {

		return new Promise((resolve, reject) => {
			const params = this.#params;
			let ajaxParams = Object.assign({}, params);

			ajaxParams.error = EmptyFn/*function (xhr, status, error) {
				response.init({error: {code: status, message: error}}, 'error', xhr);
				resolve(response);
			};*/
			ajaxParams.success = EmptyFn;/*function (result, status, xhr) {
				response.init(result, status, xhr);
				resolve(response);
			};*/

			const trigger = function (action, response, args) {
				if (!is_function(params[action]))
					return;

				params[action].apply(response, args);
			};

			$.ajax(ajaxParams)
				.done(function (result, status, xhr) {
					const response = new Response(result, status, xhr);
					trigger('success', response, [result]);
					resolve(response);
				})
				.fail(function (xhr, status, error) {
					const response = new Response({error: {code: status, message: error}}, 'error', xhr);
					trigger('error', response, [xhr, status, error]);
					resolve(response);
				})
			;
		});
	}
}
/*
var query = new function () {
	var data = {};

	this.get = function (name) {
		return data[name] ? data[name] : null;
	};

	(function () {
		let params = new URLSearchParams(window.location.search);
		for (var r of params.entries()) {
			if (r[0].indexOf('[]') > -1) {
				let n = r[0].substring(0, r[0].length - 2);
				if (!data[n])
					data[n] = [];
				data[n][data[n].length] = r[1];
			} else
				data[r[0]] = r[1];
		}
	})();
};

function error(xhr, status, error) {
	switch (status) {
		case 'Not found':
			//check auth
			if (logoutFlag)
				Loader.ping();

			break;
		case ''://offline
		default:
		//nothing
	}
}*/
