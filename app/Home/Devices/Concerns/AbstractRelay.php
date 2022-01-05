<?php

namespace App\Home\Devices\Concerns;

abstract class AbstractRelay extends AbstractDevice {

	use TimerTrait;

	public function on() {
		if ($this->state)
			return;

		$this->setState(1);

		//$this->powerSafeStart();

		return $this->moduleOn($this->register);
	}

	public function off() {
		if (!$this->state)
			return;

		$this->setState(0);

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

}
