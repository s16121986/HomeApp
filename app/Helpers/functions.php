<?php

use App\Home\Home;
use App\Home\Settings\Events;
use App\Services\IO\Com\ArduinoSerial;

function lang($key): string {
	return call_user_func_array('trans', func_get_args());
}

function home(): Home {
	return Home::getInstance();
}

function port() {
	return ArduinoSerial::getInstance();
}

function events_enabled($eventsSettings): bool {
	return Events::value() && $eventsSettings::value();
}
