<?php

namespace App\Events\Home;

use App\Custom\Contracts\InteractsWithScenario;
use Illuminate\Foundation\Events\Dispatchable;

class DayTimeChanged implements InteractsWithScenario {

	use Dispatchable;

	public function __construct() {

	}

	public function actionEntity() {
		return null;
	}

}
