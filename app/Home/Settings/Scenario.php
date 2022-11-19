<?php

namespace App\Home\Settings;

class Scenario extends AbstractSetting {

	public static function getKey(): string {
		return 'scenario';
	}

	public static function castValue($value) {
		return (string)$value;
	}

	public static function prepareValue($value) {
		return (string)$value;
	}

}
