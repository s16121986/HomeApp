<?php

namespace App\Console\Commands\Cron;

use App\Enums\DayTime;
use App\Events\Home\DayTimeChanged;
use App\Home\Settings\CronEvents;
use App\Models\Home\Sensors;
use App\Services\Yandex\Weather as YandexWeather;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class Weather extends Command {

	protected $signature = 'cron:weather';

	protected $description = '';

	public function handle() {
		$data = YandexWeather::getWeather();
		$fact = $data->fact;
		//var_dump($fact);
		$assoc = [
			'temp' => 'temperature',
			'humidity' => 'humidity',
			//'daytime' => 'daytime'
		];
		foreach ($assoc as $k => $n) {
			static::updateValue($n, $fact->$k);
		}

		$daytime = Sensors::where('name', 'daytime')->value('value');
		//$d = $fact->daytime;
		$d = static::calculateDateTime();
		if ($d !== $daytime) {
			if (events_enabled(CronEvents::class))
				DayTimeChanged::dispatch();

			static::updateValue('daytime', $d);
		}
	}

	private static function updateValue($n, $v) {
		Sensors::where('name', $n)
			->update(['value' => $v]);
	}

	private static function calculateDateTime(): string {
		$h = +date('G');
		if ($h >= 0 && $h < 7)
			return DayTime::NIGHT;
		else if ($h <= 12)
			return DayTime::MORNING;
		else if ($h < 18)
			return DayTime::DAY;
		else
			return DayTime::EVENING;
	}

}
