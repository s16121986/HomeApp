<?php

namespace App\Events\Broadcasting;

use Illuminate\Foundation\Events\Dispatchable;

class WebSocketEvent {

	use Dispatchable;

	public $connection;
	public $id;
	public $method;
	public $params;

	public function __construct($connection, $message) {
		$this->connection = $connection;
		$this->id = $message->id;
		$this->method = $message->method;
		$this->params = $message->params ?? [];
	}

	public function __get($name) {
		return $this->param($name);
	}

	public function param($name, $default = null) {
		return $this->params->$name ?? $default;
	}

	public function params() {
		return $this->params;
	}

}
