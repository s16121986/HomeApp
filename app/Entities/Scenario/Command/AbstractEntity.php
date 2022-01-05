<?php

namespace App\Entities\Scenario\Command;

abstract class AbstractEntity {

	protected $model;
	protected $params;

	public function __construct($command) {
		$this->model = $command;
		//$this->params = json_decode($command->data);
	}

	public function __get($name) {
		return $this->params[$name] ?? $this->model->$name;
	}

	protected function commandArguments(): array {
		$args = [$this->model->command];

		if ($this->model->data)
			$args[] = $this->model->data;

		return $args;
	}

	protected function command($entity): array {
		$args = $this->commandArguments();

		return $entity->command(...$args);
	}

	abstract public function handle();

}
