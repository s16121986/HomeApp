<?php

namespace App\Services\Scenario;

class Script {

	protected $expressions = [];

	public function __construct($code) {
		$this->code = $code;
	}

	public function parse() {
		$lines = explode("\n", $this->code);
	}

}
