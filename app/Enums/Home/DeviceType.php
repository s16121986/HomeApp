<?php

namespace App\Enums\Home;

use Enum;

abstract class DeviceType extends Enum {

	const CURTAINS = 'Curtains';
	const FAN = 'Fan';
	const GIDROLOCK = 'Gidrolock';
	const LIGHT_PWM = 'LightPwm';
	const LIGHT_RELAY = 'LightRelay';
	const PROJECTOR_SCREEN = 'ProjectorScreen';
	const VACUUM_CLEANER = 'VacuumCleaner';

	public static function getDeviceClass(string $type): string {
		switch ($type) {
			case 'pwm':
				$type = 'LightPwm';
				break;
			default:
				$a = []; //deprecated
				foreach (explode('_', $type) as $s) {
					$a[] = ucfirst($s);
				}
				$type = implode('', $a);
		}

		return '\App\Home\Devices\\' . $type;

		return '\App\Home\Devices\\' . $type;
	}

}
