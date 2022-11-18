<?php

namespace App\Entities\Scenario\Condition;

abstract class AbstractCondition {

	protected $condition;
	protected $data;

	public function __construct($condition) {
		$this->condition = $condition;
		if ($condition->data)
			$this->data = json_decode($condition->data);
	}

	public function __get($name) {
		return $this->data->$name ?? $this->condition->$name;
	}

	abstract public function handle(): bool;

	protected function compare($a, $b): bool {
		return match ($this->condition->expression) {
			'!=' => $a != $b,
			'>' => $a > $b,
			'<' => $a < $b,
			'in' => in_array($a, explode(',', $b)),
			'not in' => !in_array($a, explode(',', $b)),
			default => $a == $b,
		};
	}

}
