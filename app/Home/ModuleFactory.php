<?php

namespace App\Home;

use Exception;

abstract class ModuleFactory {

	public static function fromDevice($device) {
		$cls = $device->module_type;
		if (!$cls || !class_exists($cls, true))
			throw new Exception("Module class [$cls] not found");

		return new $cls($device->address);
	}

	public static function getModulesList(): array {
		$modules = [];
		$rootPath = 'Modules' . DIRECTORY_SEPARATOR;
		return self::scanModules('Modules' . DIRECTORY_SEPARATOR);

		foreach (scandir($rootPath) as $dir) {
			if (in_array($dir, ['.', '..']) || !is_dir($rootPath . $dir))
				continue;

			$modules = array_merge($modules, self::scanModules($dir));
		}

		return $modules;
	}

	private static function scanModules($path): array {
		$modules = [];
		$namespace = __NAMESPACE__ . '\\' . str_replace('/', '\\', $path);
		$rootPath = __DIR__ . DIRECTORY_SEPARATOR . $path;
		foreach (scandir($rootPath) as $entry) {
			if (in_array($entry, ['.', '..']))
				continue;
			else if (is_dir($rootPath . $entry)) {
				foreach (self::scanModules($path . $entry . '/') as $k => $v) {
					$modules[$k] = $v;
				}
			} else if (str_starts_with($entry, 'Abstract'))
				continue;
			else {
				$name = $namespace . substr($entry, 0, -4);
				$modules[$name] = lang($name);
			}
		}

		return $modules;
	}

}
