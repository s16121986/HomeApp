export default function (options) {

	const textarea = $(this);
	let disabled = false;

	options = $.extend({
		//minHeight: 26,
		maxHeight: 300
	}, options);

	//textarea.css('height', 'auto');

	const update = function () {
		/*const val = textarea.val();
		const rows = (val.match(/\n/g) || []).length + 1;
		textarea.attr('rows', rows);
		textarea[rows > 1 ? 'addClass' : 'removeClass']('multiline');*/
		textarea[0].style.height = '';
		const h = textarea[0].scrollHeight;
		if (h)
			textarea[0].style.height = h + "px";
	};

	function onchange() {
		if (!disabled)
			update();
	}

	if (options.collapseOnBlur) {
		textarea
			.focus(function () {
				disabled = false;
				textarea.css('white-space', 'normal');
				update();
			})
			.blur(function (e) {
				disabled = true;
				textarea.css('white-space', 'nowrap');
				textarea[0].style.height = '';
			});
	}

	textarea.bind('input', onchange)//keydown change cut paste
		.bind('update-height', onchange);

	$(window).resize(onchange);

	update();

	return textarea;
}
