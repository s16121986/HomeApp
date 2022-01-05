class Handler {
	#event;
	#callback;
	#scope;

	constructor(event, callback, scope) {
		this.#event = event;
		this.#callback = callback;
		this.#scope = scope;
	}

	match(event, callback) {
		return (!event || !this.#event || this.#event === event)
			&& (!callback || callback === this.#callback);
	}

	apply(self, args) { return this.#callback.apply(this.#scope || self, args); }
}

export default {
	bind(event, callback, scope) {
		if (!this._handlers)
			this._handlers = [];

		if (!callback) {
			callback = event;
			event = null;
		}

		this._handlers.push(new Handler(event, callback, scope));

		return this;
	},
	unbind(event, callback) {
		if (!this._handlers)
			return this;

		if (event) {
			for (let i = this._handlers.length - 1; i >= 0; i--) {
				if (!this._handlers[i].match(event, callback))
					continue;
				this._handlers.splice(i, 1);
			}
		} else
			delete this._handlers;

		return this;
	},
	trigger(event) {
		if (!this._handlers)
			return this;

		let args = [];
		for (let i = 1; i < arguments.length; i++) {
			args[args.length] = arguments[i];
		}

		const l = this._handlers.length;
		for (let h, i = 0; i < l; i++) {
			h = this._handlers[i];
			if (!h.match(event))
				continue;
			else if (false === h.apply(this, args))
				return false;
		}

		return this;
	},
	bindOptions(options, optionsEvents) {
		if (!options)
			return;
		for (let i = 0; i < optionsEvents.length; i++) {
			if (!is_function(options[optionsEvents[i]]))
				continue;
			this.bind(optionsEvents[i], options[optionsEvents[i]]);
		}
	}
};
