<?php

namespace App\Events\Home;

use App\Custom\Contracts\InteractsWithScenario;
use App\Models\Home\Sensors;
use Illuminate\Broadcasting\Channel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class Timer implements ShouldBroadcast, InteractsWithScenario {

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
			'sensors' => Sensors::get()->toArray()
		];
	}

	public function broadcastAs() {
		return 'home.stateRefresh';
	}

	public function actionEntity() {
		return null;
	}

}
