export default class Timer {
	#timer;
	#wtimer;
	#tries;
	#window;

	start() {
		if (this.#timer || this.#window)
			return;

		this.window();

		this.#tries = 3;
		this.#timer = setInterval(() => {
			broadcaster().open();
			if (this.#tries === 1) {
				this.stop();

			} else
				this.#tries--;
		}, 10000);
	}

	window() {
		if (this.#window)
			return;

		this.#window = $('<div class="shadow">'
			+ '<div class="window">'
			+ '<div class="window-title">Таймаут подключения</div>'
			+ '<div class="window-body">Нет связи с приложением, проверьте подключение к интернету.</div>'
			+ '<div class="window-buttons"><button>Возобновить</button></div>'
			+ '</div>'
			+ '</div>').appendTo(document.body);

		this.#window.find('button').click(() => {
			this.#window.find('>div.window').addClass('loading');
			broadcaster().open();
			this.#wtimer = setTimeout(() => { this.#window.find('>div.window').removeClass('loading'); }, 10000);
		});
	}

	open() {
		if (this.#timer || this.#window)
			return;

		this.start();

		broadcaster().open();
	}

	stop() {
		if (!this.#timer)
			return;

		clearInterval(this.#timer);
		this.#timer = null;
	}

	reset() {
		if (this.#window) {
			this.#window.remove();
			this.#window = null;
			if (this.#wtimer) {
				clearTimeout(this.#wtimer);
				this.#wtimer = null;
			}
		}

		this.stop();
	}
}
