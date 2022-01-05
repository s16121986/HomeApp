<?php

namespace App\Home\Modules\Xiaomi;

use App\Services\IO\Xiaomi\Request;

class VacuumCleaner {

	const IP = '192.168.1.104';
	const TOKEN = '3266693472594b486b586e455a753774';

	//mirobo --ip 192.168.1.104 --token 3266693472594b486b586e455a753774 start

	public function start() {
		return self::send('start');
	}

	public function stop() {
		return self::send('stop');
	}

	public function home() {
		return self::send('home');
	}

	public function fanspeed($speed) {
		return self::send('fanspeed', $speed);
	}

	public function consumables() {
		return self::send('consumables');
	}

	private static function send($command, $data = null) {
		return Request::send(self::IP, self::TOKEN, $command, $data);
	}

}
