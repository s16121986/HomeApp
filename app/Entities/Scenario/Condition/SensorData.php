<?php

namespace App\Entities\Scenario\Condition;

use App\Models\Home\Device;

class SensorData extends AbstractCondition {

	public function handle(): bool {
		$device = Device::find($this->device_id);
		return $this->compare($device->data, $this->data);
	}

}
