import {EventsTrait} from "@core.main";

let ID = 1;
let resultHandlers = {};

export default class Broadcaster {
	static #instance;
	#url;
	#ws;
	#ready = false;
	#handlers = [];

	static getInstance() {
		if (this.#instance)
			return this.#instance;

		const protocol = location.protocol === 'https:' ? 'wss' : 'ws';

		this.#instance = new Broadcaster(protocol + '://' + location.host + '/socket', {
			client: 'web_main',
		});
		//io.bind('message', data => { notifications.message(data); });
		this.#instance.open();

		return this.#instance;
	}

	constructor(url, params) {
		if (params) {
			const searchParams = new URLSearchParams(params);
			url += '?' + searchParams.toString();
		}
		this.#url = url;
	}

	get ready() { return this.#ws ? true : false; }

	async open() {
		if (this.#ws)
			return;

		const ws = new WebSocket(this.#url);

		ws.onopen = (event) => {
			this.#ws = ws;
			this.trigger('open');
			//this.unbind('open');
		};

		ws.onclose = (event) => {
			if (!this.#ws)
				return;

			this.#ws = undefined;
			/*if (event.wasClean) {
				alert('Соединение закрыто чисто');
			} else {
				alert('Обрыв соединения'); // например, "убит" процесс сервера
			}
			alert('Код: ' + event.code + ' причина: ' + event.reason);*/
			this.trigger('close', event);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			this.trigger('message', data);
			//console.log(data, resultHandlers)
			if (data.id && resultHandlers[data.id]) {
				resultHandlers[data.id].success.call(resultHandlers[data.id].scope, data.result);
				delete resultHandlers[data.id];
			}

			this.#handlers
				.filter(h => h.type === data.type)
				.forEach(h => { h.handler.call(h.scope, data.value); });
			//console.log(event);
		};

		ws.onerror = (error, a) => {
			if (!this.#ws)
				return;

			this.trigger('error', error);
			//setTimeout(function () { self.open(); }, 10000);
		};

		return this;
	}

	send(method, params, success, scope) {
		if (is_string(method))
			params = {
				method: method,
				params: params,
				success: success,
				scope: scope
			};
		else
			params = Object.assign({}, method);

		if (this.#ws) {
			if (params.success)
				resultHandlers[ID] = params;
			this.#ws.send(JSON.stringify({
				id: ID,
				method: params.method,
				params: params.params
			}));
			ID += 2;
		} else
			this.bind('open', function () { this.send(params); });

		return this;
	}

	onMessage(type, handler, scope) {
		this.#handlers.push({type, handler, scope});
		return this;
	}
}

Object.assign(Broadcaster.prototype, EventsTrait);
