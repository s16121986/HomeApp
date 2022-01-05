<?php

namespace App\Services\Scenario\Parser\Node;

use App\Home\DeviceFactory;

class Device extends Node {

	protected $device;

	public static function prefix(): string {
		return 'app.devices';
	}

	public static function regexp(): string {
		return 'app\.devices\[(\d+)\]';
		/*if (!preg_match('/^app\.devices/', $expression, $m))
			return null;

		return new static($m[1]);*/
	}

	public function __construct($id) {
		$this->device = DeviceFactory::find($id);
	}

	public function __toString(): string {
		return static::prefix() . '[' . $this->device->id . ']';
	}

}
