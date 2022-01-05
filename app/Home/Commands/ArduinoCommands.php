<?php

namespace App\Home\Commands;

use App\Models\Home\Device;

class ArduinoCommands extends AbstractCommands {

	public function plug() {
		port()->send(IO::CONFIG_BIT, \IO_CONFIG::DEVICE_EVENTS, 1);
	}

	public function ping() {
		port()->ping();
	}

	public function refresh() {
		Device::where('module_id', home()->id)
			->update([
				'state' => 0,
				'data' => null
			]);

		return home()->command('state');
	}

	public function setup() {
		$q = Device::where('enabled', 1)
			->where('module_id', env('ARDUINO_ID'));
		foreach ($q->cursor() as $model) {
			$i = port()->command($model->id, 'setpin', $model->channel);
			if ($i != 1)
				return false;
		}

		//$port->send(IO::CONFIG_BIT, \IO_CONFIG::DEVICE_EVENTS, 1);

		return true;
	}

	public function state() {
		port()->command(home()->pin, 'state');
	}

}
