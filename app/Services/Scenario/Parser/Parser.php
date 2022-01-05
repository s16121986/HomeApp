<?php

namespace App\Services\Scenario;

class Parser {

	protected $lines = [];
	protected $expressions = [];

	public function __construct($code) {
		$this->lines = explode("\n", $code);
	}

	public function shift() {
		return array_shift($this->lines);
	}

	public function next() {
		$expression = $this->shift();
		if (str_starts_with($expression, 'if '))
			$this->expressions[] = new IfStatement($this, $expression);
		else
			$this->expressions[] = new Expression($this, $expression);
	}

}
