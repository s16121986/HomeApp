<?php

namespace App\Services\Yandex;

abstract class Weather {

	const API_TOKEN = 'f7375ea2-ec65-4214-8bc7-666379595579';
	const API_URL = 'https://api.weather.yandex.ru/v2/';
	private static $location = [
		'lat' => 55.799772,
		'lon' => 37.710896,
		'lang' => 'ru'
	];

	public static function getWeather() {
		return self::send('informers');
	}

	private static function send($url, array $params = []) {
		$curlUrl = self::API_URL . $url . '?' . http_build_query(array_merge(self::$location, $params));

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $curlUrl);
		curl_setopt($ch, CURLOPT_HTTPHEADER, ['X-Yandex-API-Key: ' . self::API_TOKEN]);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		//curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);

		$res = curl_exec($ch);
		//$info = curl_getinfo($ch);

		curl_close($ch);

		return json_decode($res);
	}

}
