import {app, home, broadcaster, dashboard} from "./functions"

Object.assign(window, {
	app: app,
	home: home,
	broadcaster: broadcaster,
	dashboard: dashboard
});

import "../plugins/touch-hold"
import "../plugins/touchSlider"
