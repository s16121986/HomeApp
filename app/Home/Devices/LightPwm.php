<?php

namespace App\Home\Devices;

use App\Home\Devices\Concerns\TimerTrait;

class LightPwm extends Concerns\AbstractDevice {

	use TimerTrait;

	public function on() {
		if ($this->state)
			return;

		$this->setState(1, $this->data);

		//$this->powerSafeStart();
		return $this->moduleDimming($this->register, $this->data ?? 50);
	}

	public function off() {
		if (!$this->state)
			return;

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
		if ($percent < 0)
			return false;
		else if ($percent > 100)
			$percent = 100;

		$this->setState(1, $percent);

		return $this->moduleDimming($this->register, $percent);
	}

}
