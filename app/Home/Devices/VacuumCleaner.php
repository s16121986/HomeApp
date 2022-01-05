<?php

namespace App\Home\Devices;

class VacuumCleaner extends Concerns\AbstractDevice {

	public function start() {
		return $this->moduleStart();
	}

	public function home() {
		return $this->moduleHome();
	}

	public function stop() {
		return $this->moduleStop();
	}

}
