<?php

namespace App\Home\Settings;

class LightsState extends AbstractSetting {

	public static function getKey(): string {
		return 'lights';
	}

	public static function castValue($value) {
		return $value ? json_decode($value) : [];
	}

	public static function prepareValue($value) {
		return json_encode($value);
	}

}
