<?php

namespace App\Console\Commands\Cron;

use App\Events\Home\Timer as TimerEvent;
use Illuminate\Console\Command;

class Timer extends Command {

	protected $signature = 'cron:timer';

	protected $description = '';

	public function handle() {
		TimerEvent::dispatch();
	}

}
