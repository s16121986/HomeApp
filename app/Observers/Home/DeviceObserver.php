<?php

namespace App\Observers\Home;

use App\Events\Device\StateChanged;
use App\Events\Room\StateChanged as RoomStateChanged;
use App\Models\Home\Device;

class DeviceObserver {

	public static $loopIndex = 0;

	private static bool $roomLightEvents = false;

	private static bool $roomStateEvent = true;

	public static function setRoomLightsEvents(bool $flag) {
		self::$roomLightEvents = $flag;
	}

	public static function setRoomStateEvents(bool $flag) {
		self::$roomStateEvent = $flag;
	}

	public function saved(Device $device) {
		if (self::$loopIndex++ > 10) {
			var_dump(123);
			return;
		}

		if ($device->wasChanged('state') || $device->wasChanged('data')) {
			StateChanged::dispatch($device);

			if (self::$roomLightEvents)
				$device->room()->updateLights();
			else if (self::$roomStateEvent)
				RoomStateChanged::dispatch($device->room());
		}
	}

}
