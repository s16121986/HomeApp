<?php

namespace App\Home;

use App\Models\Home\Device;
use Exception;

abstract class DeviceFactory {

	public static function fromDevice($device) {
		$cls = $device->type;//DeviceType::getDeviceClass($device->type);
		if (!class_exists($cls, true))
			throw new Exception('Device class [' . $cls . '] not found');

		return new $cls($device);
	}

	public static function find($id) {
		return self::fromDevice(Device::find($id));
	}

	public static function getDevicesList(): array {
		return self::scanFolder('Devices');
	}

	public static function getSensorsList(): array {
		return self::scanFolder('Sensors');
	}

	private static function scanFolder($path): array {
		$list = [];
		$rootPath = __DIR__ . DIRECTORY_SEPARATOR . $path . DIRECTORY_SEPARATOR;

		foreach (scandir($rootPath) as $entry) {
			if (in_array($entry, ['.', '..']) || is_dir($rootPath . $entry))
				continue;
			else if (str_starts_with($entry, 'Abstract'))
				continue;

			$name = __NAMESPACE__ . '\\' . $path . '\\' . substr($entry, 0, -4);
			$list[$name] = lang($name);
		}

		return $list;
	}

}
