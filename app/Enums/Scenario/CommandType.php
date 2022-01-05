<?php

namespace App\Enums\Scenario;

use Enum;

abstract class CommandType extends Enum {

	const HOME = 1;
	const ROOM = 2;
	const DEVICE = 3;
	const SCENARIO = 4;

	//const HOME_SCENARIO = 1;

}
