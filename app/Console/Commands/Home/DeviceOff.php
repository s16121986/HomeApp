<?php

namespace App\Console\Commands\Home;

use App\Home\DeviceFactory;
use Illuminate\Console\Command;
use Exception;

class DeviceOff extends Command {

	protected $signature = 'device:off
		{id}';

	protected $description = '';

	public function handle() {
		$id = $this->argument('id');
		$device = DeviceFactory::find($id);
		if (!$device)
			throw new Exception('Device [' . $id . '] not found');

		$device->command('off');
	}

}
