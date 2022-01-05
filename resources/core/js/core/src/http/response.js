export default class Response {
	#result;
	#xhr;
	#status;

	constructor(result, status, xhr) {
		if (typeof result === 'string' && '{' === result.substr(0, 1))
			result = JSON.parse(result);
		if (result.success === false || result.error)
			status = 'error';

		this.#xhr = xhr;
		this.#result = result;
		this.#status = status;
	}

	get action() { return this.#result.action; }

	get(param) { return this.#result[param]; }

	isEmpty() { return is_empty(this.#result); }

	isAction() { return undefined !== this.#result.action; }

	isError() { return this.#status === 'error'; }

	getError() { return this.#result.message; }

	getText() { return this.#xhr.responseText; }

	getData() { return this.#result; }
}
