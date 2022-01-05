<?php

namespace App\Entities\Scenario\Condition;

abstract class AbstractCondition {

	protected $condition;
	protected $data;

	public function __construct($condition) {
		$this->condition = $condition;
		if (str_starts_with($condition->value, '{'))
			$this->data = json_decode($condition->value);
	}

	public function __get($name) {
		return $this->data[$name] ?? $this->condition->$name;
	}

	abstract public function handle(): bool;

}
