<?php

namespace App\Services\Scenario;

use App\Services\Scenario\Parser\Node\Device;

class Expression {

	const DEVICES_PREFIX = 'app.devices';
	const ROOMS_PREFIX = 'app.rooms';
	const SCENARIOS_PREFIX = 'app.scenarios';

	protected $expressions = [];

	public function parse($expression) {
		$expression = trim($expression);
		if (Device::starts_with($expression))
			$this->expressions[] = new IfStatement($expression);
	}

}
