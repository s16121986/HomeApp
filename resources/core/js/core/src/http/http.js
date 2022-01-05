import Request from "./request.js"

function defaultAction(response) {
	if (!response.action)
		return;

	switch (response.action) {
		case 'redirect':
			return HttpClass.redirect(response.get('url'));
		case 'reload':
			return HttpClass.reload(response.get('url'));
	}
}

export class HttpClass {
	#instance;
	#relativePath = '/';

	_url(url) {
		if ('/' === url.substr(0, 1) || url.substr(0, 4) === 'http')
			return url;
		else
			return this.#relativePath + url;
	}

	async _send(args, params) {
		if (typeof args[1] === 'function') {
			args[2] = args[1];
			args[1] = null;
		}

		if (typeof args[0] === 'object')
			params = Object.assign({}, args[0], params);
		else
			params = Object.assign({
				url: args[0],
				data: args[1],
				success: args[2],
				dataType: args[3]
			}, params);

		params.url = this._url(params.url);

		const request = new Request(params);
		const response = await request.send();

		defaultAction(response);

		return response;
	}

	setRelativePath(path) {
		this.#relativePath = path;
	}

	async getJSON(url, data, success) { return this._send(arguments, {dataType: 'json'}); }

	async get(url, data, success, dataType) { return this._send(arguments, {method: 'get'}); }

	async post(url, data, success, dataType) { return this._send(arguments, {method: 'post'}); }

	async put(url, data, success, dataType) { return this._send(arguments, {method: 'put'}); }

	async delete(url, data, success, dataType) { return this._send(arguments, {method: 'delete'}); }

	async ajax(data) { return this._send(arguments); }

	static redirect(url) {
		document.location = url;
	}

	static reload(noConfirmMsg) {
		if (false !== noConfirmMsg)
			window.noBefereUnloadMesage = true;
		location.reload(true);
	}
}

const Http = new HttpClass();

export default Http;
