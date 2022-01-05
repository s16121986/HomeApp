<?php

namespace App\Home\Devices;

use App\Enums\Home\DeviceGroup;

class Curtains extends Concerns\AbstractDevice {

	public function open() {
		return $this->moduleOpen();
	}

	public function stop() {
		return $this->moduleStop();
	}

	public function close() {
		return $this->moduleClose();
	}

}
