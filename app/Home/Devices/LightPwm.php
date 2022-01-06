<?php

namespace App\Home\Devices;

use App\Home\Devices\Concerns\TimerTrait;

class LightPwm extends Concerns\AbstractDevice {

	use TimerTrait;

	public function on() {
		if (!$this->state(1))
			return;

		//$this->powerSafeStart();
		return $this->moduleDimming($this->register, $this->data('brightness') ?? 50);
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
		if ($percent <= 0)
			$percent = 1;
		else if ($percent > 100)
			$percent = 100;

		if (!$this->state(1, ['brightness' => $percent]))
			return;

		return $this->moduleDimming($this->register, $percent);
	}

}
