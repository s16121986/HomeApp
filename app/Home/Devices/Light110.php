<?php

namespace App\Home\Devices;

use App\Home\Devices\Concerns\TimerTrait;

class Light110 extends Concerns\AbstractDevice {

	use TimerTrait;

	public function on() {
		if (!$this->state(1))
			return;

		//$this->powerSafeStart();

		$brightness = $this->data('brightness');

		return $this->moduleDimming($this->register, $brightness ? self::preparePercent($brightness) : 30);
	}

	public function off() {
		if (!$this->state(0))
			return;

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
		if ($b <= 0)
			$b = 1;

		if (!$this->state(1, ['brightness' => $percent]))
			return;

		return $this->moduleDimming($this->register, $b);
	}

	protected static function preparePercent($percent): float {
		if ($percent > 100)
			$percent = 100;
		return round($percent / 2); //max 50%
	}

}
