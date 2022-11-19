<?php

namespace App\Home\Settings;

class CronEvents extends AbstractBool {

	public static function getKey(): string {
		return 'events.cron';
	}

}
