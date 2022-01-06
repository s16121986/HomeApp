<?php

namespace App\Home\Devices;

class Flowers extends Concerns\AbstractDevice {

	public function on() {
		if (!$this->state(1))
			return;

		return $this->moduleFlowersLightOn();
	}

	public function off() {
		if (!$this->state(0))
			return;

		return $this->moduleFlowersLightOff();
	}

	public function toggle() {
		if ($this->state)
			return $this->off();
		else
			return $this->on();
	}

	public function brightness($percent) {
		if ($percent < 0)
			return false;
		else if ($percent > 100)
			$percent = 100;

		$this->state(1, ['brightness' => $percent]);

		return $this->moduleFlowersLightBrightness($percent);
	}

	public function irrigate() {
		return $this->moduleFlowersIrrigate();
	}

}
