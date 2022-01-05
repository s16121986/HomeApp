<?php

namespace App\Entities\Scenario\Command;

use App\Home\DeviceFactory;

class Device extends AbstractEntity {

	public function device() {
		return DeviceFactory::find($this->entity_id);
	}

	public function handle() {
		return $this->command($this->device());
	}

}
