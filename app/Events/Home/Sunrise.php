<?php

namespace App\Events\Home;

use App\Custom\Contracts\InteractsWithScenario;
use App\Models\Scenario\Action;
use Illuminate\Foundation\Events\Dispatchable;

class Sunrise implements InteractsWithScenario {

	use Dispatchable;

	public function __construct() {

	}

	public function actionEntity() {
		return null;
	}

}
