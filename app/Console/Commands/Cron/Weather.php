<?php

namespace App\Console\Commands\Cron;

use App\Events\Home\Nightfall;
use App\Events\Home\Sunrise;
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
		$daytime = Sensors::where('name', 'daytime')->value('value');
		$assoc = [
			'temp' => 'temperature',
			'humidity' => 'humidity',
			'daytime' => 'daytime'
		];
		foreach ($assoc as $k => $n) {
			Sensors::where('name', $n)
				->update(['value' => $fact->$k]);
		}

		if ($fact->daytime !== $daytime) {
			switch ($fact->daytime) {
				case 'd':
					Sunrise::dispatch();
					break;
				case 'n':
					Nightfall::dispatch();
					break;
			}
		}
	}

}
