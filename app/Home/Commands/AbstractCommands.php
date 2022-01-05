<?php

namespace App\Home\Commands;

use Exception;

abstract class AbstractCommands {

	public function command($command, $data = null) {
		if (!method_exists($this, $command))
			throw new Exception('Command [' . $command . '] not found');

		if ($data)
			return $this->$command($data);
		else
			return $this->$command();

		//return App::getPort()->command(HomeRepository::home()->pin, $command, $data);
	}

}
