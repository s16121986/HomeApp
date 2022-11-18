<?php

namespace App\Entities\Scenario\Condition;

use App\Models\Home\Room;

class RoomState extends AbstractCondition {

	public function handle(): bool {
		$room = Room::find($this->room_id);
		return $this->compare($room->light_state, $this->state);
	}

}
