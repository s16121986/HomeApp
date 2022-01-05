<?php

namespace App\Events\Room;

use App\Custom\Contracts\InteractsWithScenario;
use App\Models\Home\Device;
use App\Models\Home\Room;
use App\Models\Scenario\Action;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class StateChanged implements ShouldBroadcast, InteractsWithScenario {

	use Dispatchable, InteractsWithSockets;

	protected Room $room;

	public function __construct(Room $room) {
		$this->room = $room;
	}

	public function broadcastWhen(): bool {
		return true;
	}

	public function broadcastOn() {
		return new Channel('home');
	}

	public function broadcastWith() {
		return $this->room->toArray();
	}

	public function broadcastAs() {
		return 'room.stateChanged';
	}

	public function actionEntity() {
		return $this->room;
	}

}
