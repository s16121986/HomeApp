<?php

namespace App\Observers\Home;

use App\Events\Device\StateChanged;
use App\Events\Room\StateChanged as RoomStateChanged;
use App\Models\Home\Device;

class DeviceObserver {

	//public static $loopIndex = 0;

	private static bool $roomLightEvents = false;

	private static bool $roomStateEvent = true;

	public static function setRoomLightsEvents(bool $flag) {
		self::$roomLightEvents = $flag;
	}

	public static function setRoomStateEvents(bool $flag) {
		self::$roomStateEvent = $flag;
	}

	public function saved(Device $device) {
		if ($device->wasChanged('state') || $device->wasChanged('data')) {
			StateChanged::dispatch($device);

			$room = $device->room();
			if (self::$roomLightEvents)
				$room->updateLights();

			if (self::$roomStateEvent)
				RoomStateChanged::dispatch($room);
		}
	}

}
