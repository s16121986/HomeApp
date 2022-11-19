<?php

namespace App\Events\Home;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class SettingsChanged implements ShouldBroadcast {

	use Dispatchable, InteractsWithSockets;

	private $setting;

	public function __construct($setting) {
		$this->setting = $setting;
	}

	public function broadcastWhen(): bool {
		return true;
	}

	public function broadcastOn() {
		return new Channel('home');
	}

	public function broadcastWith() {
		return [
			'name' => $this->setting->id,
			'value' => $this->setting->value()
		];
	}

	public function broadcastAs() {
		return 'home.settingsChanged';
	}

}
