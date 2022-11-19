<?php

namespace App\Home\Settings;

abstract class AbstractSetting {

	public static function getKey(): string {
		return static::class;
	}

	public static function __callStatic(string $name, array $arguments) {
		$instance = static::get();

		return $instance->$name(...$arguments);
	}

	public static function get() {
		return home()->settings()->get(static::getKey());
	}

	abstract public static function castValue($value);

	abstract public static function prepareValue($value);

}
