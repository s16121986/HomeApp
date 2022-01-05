<?php

namespace App\Listeners;

use App\Events\Arduino\ControllerBooted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class ArduinoEventSubscriber {

	/*public function handle($eventName, array $data) {
		$event = $data[0];
	}*/

	public function handleControllerBoot($event) {
		home()->command('setup');
	}

	public function subscribe($events) {
		return [
			ControllerBooted::class => 'handleControllerBoot',
			//'App\Events\Arduino\*' => 'handle',
		];
	}

}
