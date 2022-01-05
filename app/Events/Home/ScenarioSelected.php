<?php

namespace App\Events\Home;

use App\Custom\Contracts\InteractsWithScenario;
use App\Models\Scenario\Action;
use Illuminate\Foundation\Events\Dispatchable;

class ScenarioSelected implements InteractsWithScenario {

	use Dispatchable;

	protected $scenario;

	public function __construct($scenario) {
		$this->scenario = $scenario;
	}

	public function actionEntity() {
		return $this->scenario;
	}

}
