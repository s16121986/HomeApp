<?php

namespace App\Entities\Scenario\Condition;

class DayTime extends AbstractCondition {

	public function handle(): bool {
		return home()->getDaytime() == $this->value;
	}

}
