<?php

namespace App\Events\Sensors;

use App\Custom\Contracts\InteractsWithScenario;
use App\Models\Home\Device;
use App\Models\Scenario\Action;
use Illuminate\Foundation\Events\Dispatchable;

abstract class AbstractDeviceEvent implements InteractsWithScenario {

	use Dispatchable;

	public $code;

	protected Device $device;

	public function __construct(Device $device) {
		$this->device = $device;
	}

	public function __get(string $name) {
		return match ($name) {
			'device_id' => $this->device->id,
			default => $this->device->$name,
		};
	}

	public function actionEntity() {
		return $this->device;
	}

}
