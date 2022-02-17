<?php

namespace App\Console\Commands\Daemon;

use App\Events\Arduino\ControllerBooted;
use App\Events\Sensors\ButtonHolded;
use App\Events\Sensors\ButtonPressed;
use App\Events\Sensors\ButtonReleased;
use App\Events\Sensors\MotionDetected;
use App\Models\Home\Device;
use Illuminate\Console\Command;
use stdClass;

class ArduinoEvent extends Command {

	//const EVENT_INIT = 1;
	//const EVENT_BUTTON_HOLD = 10; //deprecated
	const EVENT_BUTTON_PRESS = 1;
	const EVENT_BUTTON_RELEASE = 2;
	const EVENT_BUTTON_HOLD = 3;
	//const EVENT_SENSOR_STATE = 14;
	//const EVENT_MOTION_DETECT = 15;

	protected $signature = 'arduino:event
		{--address= : Data}
		{--pin= : Arduino pin}
		{--event= : Event}';

	protected $description = '';

	public function handle() {
		$data = new stdClass();
		$data->address = $this->option('address');
		$data->pin = $this->option('pin');
		$data->event = (int)$this->option('event');
		//$data->data = $this->option('data');
		if (!$data->pin)
			return $this->error('Pin argument required');

		//EventManager::event($data);
		//if ($data->pin == home()->pin)
		//	return self::homeEvent($data);

		$device = Device::where('module_id', 1)
			->where('channel', $data->pin)
			->whereEnabled()
			->first();
		//if (!$device)
		//	return $this->error('Device [pin=' . $data->pin . '] not found');

		if ($device)
			self::deviceEvent($data, $device);
	}

	private static function homeEvent($data) {
		switch ($data->event) {
			case self::EVENT_INIT:
				ControllerBooted::dispatch();
				break;
		}
	}

	private static function deviceEvent($data, $device) {
		switch ($data->event) {
			case self::EVENT_BUTTON_PRESS:
				ButtonPressed::dispatch($device);
				break;
			case self::EVENT_BUTTON_RELEASE:
				ButtonReleased::dispatch($device);
				break;
			case self::EVENT_BUTTON_HOLD:
				ButtonHolded::dispatch($device);
				break;
			/*case self::EVENT_SENSOR_STATE:
				SensorState::dispatch($device, $data->data);
				break;
			case self::EVENT_MOTION_DETECT:
				MotionDetected::dispatch($device);
				break;*/
		}
	}

}
