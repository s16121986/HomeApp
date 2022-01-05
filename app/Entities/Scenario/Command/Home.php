<?php

namespace App\Entities\Scenario\Command;

class Home extends AbstractEntity {

	public function handle() {
		$this->command(home());
	}

}
