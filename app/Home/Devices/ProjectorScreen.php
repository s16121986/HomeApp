<?php

namespace App\Home\Devices;

class ProjectorScreen extends Concerns\AbstractDevice {

	public function open() {
		return $this->moduleOpen();
	}

	public function close() {
		return $this->moduleClose();
	}

	public function stop() {
		return $this->moduleStop();
	}

}
