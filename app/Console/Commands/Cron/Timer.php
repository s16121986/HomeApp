<?php

namespace App\Console\Commands\Cron;

use App\Events\Home\Timer as TimerEvent;
use App\Home\Settings\CronEvents;
use Illuminate\Console\Command;

class Timer extends Command {

	protected $signature = 'cron:timer';

	protected $description = '';

	public function handle() {
		if (!events_enabled(CronEvents::class))
			return;

		TimerEvent::dispatch();
	}

}
