<?php

namespace App\Enums;

use Enum;

abstract class DayTime extends Enum {

	const NIGHT = 'n';
	const MORNING = 'm';
	const DAY = 'd';
	const EVENING = 'e';

}
