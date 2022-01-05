export default class Timeout {
	#timer;
	#timeout;
	#callback;

	constructor(callback, timeout) {
		this.#callback = callback;
		this.#timeout = timeout;
	}

	start() {
		this.stop();
		this.#timer = setTimeout(this.#callback, this.#timeout);
		return this;
	}

	stop() {
		if (!this.#timer)
			return this;
		clearTimeout(this.#timer);
		this.#timer = null;
		return this;
	}

	isStarted() { return this.#timer !== null; };
};
