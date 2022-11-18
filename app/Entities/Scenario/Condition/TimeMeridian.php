<?php

namespace App\Entities\Scenario\Condition;

class TimeMeridian extends AbstractCondition {

	public function handle(): bool {
		return $this->compare(home()->getTimeMeridian(), $this->meridian);
	}

}
