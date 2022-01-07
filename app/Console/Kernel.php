<?php

namespace App\Console;

use App\Console\Commands\Cron\Timer;
use App\Console\Commands\Cron\Weather;
use App\Console\Commands\Daemon\ArduinoEvent;
use App\Console\Commands\Home\DeviceOff;
use App\Console\Commands\Home\DeviceOn;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel {

	protected $commands = [
		ArduinoEvent::class,
		DeviceOff::class,
		DeviceOn::class,
		Timer::class,
		Weather::class
	];

	/**
	 * Define the application's command schedule.
	 *
	 * @param \Illuminate\Console\Scheduling\Schedule $schedule
	 * @return void
	 */
	protected function schedule(Schedule $schedule) {
		// $schedule->command('inspire')->hourly();
	}

	/**
	 * Register the commands for the application.
	 *
	 * @return void
	 */
	protected function commands() {
		/*$this->load(__DIR__ . '/Commands');

		require base_path('routes/console.php');*/
	}

}
