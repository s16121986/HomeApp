<?php

namespace App\Entities\Scenario\Command;

class Room extends AbstractEntity {

	public function room() {
		return home()->room($this->entity_id);
	}

	public function handle() {
		return $this->command($this->room());
	}

}
