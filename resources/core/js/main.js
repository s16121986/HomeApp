window.$ = window.jQuery = require('jquery');

import 'jquery-mask-plugin/dist/jquery.mask.min';

import buttonPopup from "./plugins/buttonPopup.js"
import buttonWindow from "./plugins/buttonWindow.js"
import toggleContent from "./plugins/toggleContent.js"

Object.assign($.fn, {
	buttonPopup: buttonPopup,
	buttonWindow: buttonWindow,
	toggleContent: toggleContent
});

export * from "./core/index.js"
//import "js-cookie";

import {Window} from "./ui/window/index.js";

export {Window};

//import("./page/auth.js");
