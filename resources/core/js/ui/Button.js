export default class Button {
	$el;
	$options;

	constructor(options) {
		this.$options = options;
	}

	render(container) {
		const self = this;
		const html = ['<button', (this.$options.cls ? ' class="' + this.$options.cls + '"' : ''), ' type="button">',
			this.$options.text,
			'</button>'].join('');

		this.$el = $(html).click(function () {
			self.$options.handler.call(self.$options.scope, self);
		}).appendTo(container);
	};
}
