<?php

namespace App\Observers\Home;

use App\Events\Room\StateChanged;
use App\Models\Home\Room;

class RoomObserver {

	public function saved(Room $room) {
		/*if ($room->wasChanged('lights')) {
			StateChanged::dispatch($room);
		}*/
	}

}
