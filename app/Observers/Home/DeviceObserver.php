<?php

namespace App\Observers\Home;

use App\Events\Device\StateChanged;

//use App\Events\Room\StateChanged as RoomStateChanged;
use App\Models\Home\Device;
use App\Models\Home\Room;

class DeviceObserver {

	private static bool $roomEvents = false;

	public static function setRoomEventsEnabled(bool $flag) {
		self::$roomEvents = $flag;
	}

	public function saved(Device $device) {
		if ($device->wasChanged('state') || $device->wasChanged('data')) {
			StateChanged::dispatch($device);

			//RoomStateChanged::dispatch($device->room());
			if (self::$roomEvents)
				$device->room()->updateLights();
		}
	}

}
