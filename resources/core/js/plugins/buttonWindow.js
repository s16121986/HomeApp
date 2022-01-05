import Window from "../ui/window/window"

export default function buttonWindow(options) {
	return $(this).click(function (e) {
		e.preventDefault();
		const win = new Window(options);
		win.show();
	});
};
