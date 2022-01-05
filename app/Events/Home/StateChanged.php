<?php

namespace App\Events\Home;

use App\Models\Home\Room;
use App\Models\Home\Settings;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class StateChanged implements ShouldBroadcast {

	use Dispatchable, InteractsWithSockets;

	public function __construct() {
	}

	public function broadcastWhen(): bool {
		return true;
	}

	public function broadcastOn() {
		return new Channel('home');
	}

	public function broadcastWith() {
		return [
			'home' => Room::home()->toArray(),
			//'settings' => Settings::getData()
		];
	}

	public function broadcastAs() {
		return 'home.stateChanged';
	}

}
