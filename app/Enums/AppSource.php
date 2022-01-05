<?php

namespace App\Enums;

use Enum;

abstract class AppSource extends Enum {

	const ADMIN_PANEL = 1;
	const WEB = 2;
	const API = 3;
	const CHATBOT = 4;
	const CALL_CENTER = 5;

}
