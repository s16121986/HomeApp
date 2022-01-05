<?php

namespace App\Events\Device;

use App\Custom\Contracts\InteractsWithScenario;
use App\Models\Home\Device;
use App\Models\Scenario\Action;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class StateChanged implements ShouldBroadcast, InteractsWithScenario {

	use Dispatchable, InteractsWithSockets;

	protected Device $device;

	public function __construct(Device $device) {
		$this->device = $device;
	}

	public function __get($name) {
		return match ($name) {
			'device_id' => $this->device->id,
			default => $this->device->$name,
		};
	}

	public function broadcastWhen(): bool {
		return true;
	}

	public function broadcastOn() {
		return new Channel('home');
	}

	public function broadcastWith() {
		return [
			'id' => $this->device->id,
			'state' => $this->device->state,
			'data' => $this->device->data,
			'time' => time()
		];
	}

	public function broadcastAs() {
		return 'device.stateChanged';
	}

	public function actionEntity() {
		return $this->device;
	}

}
