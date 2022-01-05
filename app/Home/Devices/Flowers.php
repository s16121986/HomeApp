<?php

namespace App\Home\Devices;

class Flowers extends Concerns\AbstractDevice {

	public function lightOn() {
		$this->setState(1);

		return $this->moduleFlowersLightOn();
	}

	public function lightOff() {
		$this->setState(0);

		return $this->moduleFlowersLightOff();
	}

	public function lightToggle() {
		if ($this->state)
			return $this->lightOff();
		else
			return $this->lightOn();
	}

}
