<?php

namespace App\Entities\Scenario\Condition;

class TimeEqual extends AbstractCondition {

	public function handle(): bool {
		return $this->compare(date('H:i'), $this->time);
	}

}
