<?php

namespace App\Home\Settings;

abstract class AbstractBool extends AbstractSetting {

	public static function castValue($value) {
		return (bool)$value;
	}

	public static function prepareValue($value) {
		return $value ? 1 : 0;
	}

}
