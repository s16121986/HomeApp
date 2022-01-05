<?php

namespace App\Enums\System;

use Enum;

abstract class DeviceTimerType extends Enum {

	const TIMEOUT = 1;
	const POWER_SAFE = 2;
	const OFF_DELAY = 3;

}
