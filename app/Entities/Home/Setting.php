<?php

namespace App\Entities\Home;

use App\Events\Home\SettingsChanged;
use App\Models\Home\Settings;

class Setting {

	private $facade;

	public function __construct($facade) {
		$this->facade = $facade;
	}

	public function __get(string $name) {
		if ($name === 'id')
			return $this->facade::getKey();
		else
			return null;
	}

	public function value() {
		return $this->facade::castValue(static::getDBValue($this->facade::getKey()));
	}

	public function change($value) {
		static::setDBValue($this->facade::getKey(), $this->facade::prepareValue($value));

		SettingsChanged::dispatch($this);
	}

	private static function getDBValue($name) {
		return Settings::where('name', $name)->value('value');
	}

	private static function setDBValue($name, $value) {
		Settings::where('name', $name)
			->update(['value' => $value]);
	}

}
