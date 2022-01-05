<?php

namespace App\Services\Scenario\Parser\Node;

class Method extends Node {

	protected $name;
	protected $arguments;

	public static function regexp() {
		return '(\w+)\(([^)]*)\)';
	}

	public function __construct($expression) {
		if (empty($expression))
			return;

		foreach (explode(',', $expression) as $arg) {
			$arg = trim($arg);
			if (is_numeric($arg))
				$this->arguments[] = (int)$arg;
			else
				$this->arguments[] = trim($arg, '"');
		}
	}

	public function __toString(): string {
		return '(' . implode(', ', $this->arguments) . ')';
	}

}
