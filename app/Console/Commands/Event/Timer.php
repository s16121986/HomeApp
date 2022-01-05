<?php

namespace App\Console\Commands\Event;

use App\Events\Home\Timer as TimerEvent;
use Illuminate\Console\Command;

class Timer extends Command {

	protected $signature = 'event:timer';

	protected $description = '';

	public function handle() {
		TimerEvent::dispatch();
	}

}
