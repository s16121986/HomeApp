<?php

namespace App\Console\Commands\Home;

use App\Enums\System\DeviceTimerType;
use App\Home\DeviceFactory;
use Illuminate\Console\Command;
use Exception;

class DeviceOn extends Command {

	protected $signature = 'device:on
		{id}
		{--timeout= : }';

	protected $description = '';

	public function handle() {
		$id = $this->argument('id');
		$device = DeviceFactory::find($id);
		if (!$device)
			throw new Exception('Device [' . $id . '] not found');

		$device->command('on');

		$timeout = $this->option('timeout');
		if ($timeout)
			$device->deviceTimer()->start($timeout, DeviceTimerType::TIMEOUT);
	}

}
