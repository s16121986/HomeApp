<?php

namespace App\Services\Yandex\Devices;

use App\Home\DeviceFactory;
use Exception;

abstract class AbstractDevice {

	protected $device;
	protected $capabilities = [];

	public static function factory($device) {
		//if (!$device->group_key)
		//	throw new Exception('Group key undefined (moduleID=' . $device->id . ')');

		$cls = __NAMESPACE__ . '\\' . self::getDeviceClass($device);
		if (!class_exists($cls, true))
			throw new Exception('Device class not found (moduleID=' . $device->id . ';' . $cls . ')');

		return new $cls($device);
	}

	protected function __construct($device) {
		$this->device = DeviceFactory::fromDevice($device);
	}

	public function toArray() {
		$device = $this->device;

		return [
			'id' => (string)$device->id,
			'name' => $device->ya_name,
			'description' => $device->room_name . ' ' . $device->name,
			'type' => static::$type,
			'room' => $device->room_name,
			'capabilities' => $this->capabilities
		];
	}

	abstract protected function addCapabilitiesData();

	abstract protected function addCapabilitiesState();

	private static function getDeviceClass($device): string {
		return match ($device->type) {
			'App\Home\Devices\LightRelay', 'App\Home\Devices\LightPwm', 'App\Home\Devices\Light110' => 'Light',
			'App\Home\Devices\Fan' => 'Fan',
			'App\Home\Devices\ProjectorScreen' => 'ProjectorScreen',
			'App\Home\Devices\VacuumCleaner' => 'VacuumCleaner',
			'App\Home\Devices\Curtains' => 'Curtains',
			default => throw new Exception('Device class not found (moduleID=' . $device->id . ';' . $device->type . ')'),
		};
	}

}
