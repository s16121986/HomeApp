<?php

namespace App\Entities\Scenario\Condition;

class DayTime extends AbstractCondition {

	public function handle(): bool {
		return $this->compare(home()->getDaytime(), $this->daytime);
	}

}
