<?php

namespace App\Home\Sensors;

use App\Enums\Home\DeviceGroup;
use App\Models\Home\Device;
use App\Home\ModuleFactory as ModuleFactory;
use Exception;

abstract class AbstractSensor {

	protected $module;
	protected Device $model;

	public function __construct(Device $model) {
		$this->model = $model;
	}

	public function __get(string $name) {
		return match ($name) {
			'register' => $this->model->channel,
			default => $this->model->$name,
		};
	}

	public function __call(string $name, array $arguments) {
		if (str_starts_with($name, 'module')) {
			$name = substr($name, 6);
			$module = $this->module();
			if (!method_exists($module, $name))
				throw new Exception('Module method [' . $name . '] not exists');

			return call_user_func_array([$module, $name], $arguments);
		}

		throw new Exception('Device method [' . $name . '] not exists');
	}

	public function module() {
		return $this->module ?? $this->module = ModuleFactory::fromDevice($this->model);
	}

	protected function setState($state, $data = null): bool {
		return $this->model->setState($state, $data);
	}

}
