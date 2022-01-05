<?php

namespace App\Custom\Contracts;

use App\Models\Scenario\Action;

interface InteractsWithScenario {

	//public function actionWhen(Action $action) : bool;

	public function actionEntity();

}
