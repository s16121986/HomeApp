<?php

namespace App\Repositories;

use App\Entities\Home\Setting;
use App\Home\Settings;

class SettingsRepository {

	private $settings = [];

	public function __construct() {
		$facades = [
			Settings\LightsState::class,
			Settings\Events::class,
			Settings\ButtonEvents::class,
			Settings\MotionEvents::class,
			Settings\CronEvents::class,
			Settings\Scenario::class,
		];

		foreach ($facades as $cls) {
			$this->settings[$cls::getKey()] = new Setting($cls);
		}
	}

	public function get($name) {
		return $this->settings[$name] ?? null;
	}

	public function setValue($name, $value) {
		$setting = $this->get($name);
		$setting->change($value);
	}

	public function getValue($name) {
		$setting = $this->get($name);
		$setting->value();
	}

	public function getData(): array {
		$data = [];
		foreach ($this->settings as $k => $setting) {
			$data[$k] = $setting->value();
		}
		return $data;
	}

	public static function scenario(string $scenario = null) {
		if (null === $scenario)
			return static::getValue('scenario');
		else
			static::setValue('scenario', $scenario);
	}

}
