import "../vendor/jquery-ui.min"
import "../app/app"
import Dashboard from "../app/dashboard/dashboard"
import Timer from "../socket/timer"

let focused = true;

$(document).ready(async function () {
	const container = $(document.body);
	const dashboard = Dashboard.getInstance();
	let broadcastTimer = new Timer();

	container.addClass('loading unselectable');

	await app()
		.bind('ready', function () {
			container.append(dashboard.el);
			container.removeClass('loading');

			broadcaster()
				.bind('open', () => {
					container.removeClass('loading');
					broadcastTimer.reset();
				})
				.bind('close', () => {
					container.addClass('loading');
					if (focused)
						broadcastTimer.start();
				});

			window.addEventListener('blur', () => { focused = false; });
			window.addEventListener('focus', () => {
				focused = true;
				if (!broadcaster().ready)
					broadcastTimer.open();
			});
		})
		.boot();
	//app()
});
