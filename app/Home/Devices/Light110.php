<?php

namespace App\Home\Devices;

use App\Home\Devices\Concerns\TimerTrait;

class Light110 extends Concerns\AbstractDevice {

	use TimerTrait;

	public function on() {
		$this->setState(1, $this->data);

		//$this->powerSafeStart();

		return $this->moduleDimming($this->register, $this->data ? self::preparePercent($this->data) : 30);
	}

	public function off() {
		$this->setState(0, $this->data);

		//$this->timerStop();

		return $this->moduleOff($this->register);
	}

	public function toggle($timeout = null) {
		if ($this->state)
			return $this->off();
		else if ($timeout)
			return $this->timer($timeout);
		else
			return $this->on();
	}

	public function brightness($percent) {
		$b = self::preparePercent($percent);
		if ($b < 0)
			return false;

		$this->setState($this->state, $percent);

		if ($this->state) {
			//$this->powerSafeStart();

			return $this->moduleDimming($this->register, $b);
		} else
			return true;
	}

	protected static function preparePercent($percent): float {
		if ($percent > 100)
			$percent = 100;
		return round($percent / 2); //max 50%
	}

}
