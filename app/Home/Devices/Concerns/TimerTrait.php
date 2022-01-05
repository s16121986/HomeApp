<?php

namespace App\Home\Devices\Concerns;

use App\Entities\DeviceTimer;
use App\Enums\System\DeviceTimerType;

trait TimerTrait {

	public function deviceTimer(): DeviceTimer {
		return new DeviceTimer($this->model);
	}

	public function timer($timeout) {
		$timer = $this->deviceTimer();
		if ($timer->findByType(DeviceTimerType::OFF_DELAY))
			return;

		$timer->start($timeout, DeviceTimerType::TIMEOUT);

		return $this->on();
	}

}
