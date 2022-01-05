<?php

namespace App\Services\Scenario;

use App\Models\Home\Room;
use App\Services\Scenario\Parser\Node\Device;
use App\Services\Scenario\Parser\Node\Method;

class Command {

	const DEVICES_SEGMENT = 'Устройства';
	const ROOMS_SEGMENT = 'Комнаты';
	const SCENARIOS_SEGMENT = 'Сценарии';

	protected $segments;
	protected $node;
	protected $method;
	protected $arguments = [];

	public function parseCommand($expression) {
		if (Device::starts_with($expression))
			$this->deviceNode($expression);
	}

	public function next($segment) {
		if (!$this->current)
			$this->homeSegment();
		else if ($this->current === home())
			$this->roomSegment($segment);
	}

	protected function homeSegment($segment) {
		$this->current = $segment === 'Дом' ? home() : null;
	}

	protected function roomSegment($segment) {
		$this->current = Room::where('name', $segment)->first();
	}

	protected function deviceNode($expression) {
		$node = Device::match($expression);

		if (!$this->parseMethod($expression, $node))
			return;

		$this->node = $node;
	}

	protected function parseMethod($expression, $node): bool {
		if (!$node)
			return false;

		$expression = substr($expression, strlen($node));

		if (!str_starts_with($expression, '.'))
			return false;

		return (bool)($this->method = Method::match(substr($expression, 1)));
	}

}
