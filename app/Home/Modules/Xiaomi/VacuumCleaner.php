<?php
//https://github.com/Maxmudjon/com.xiaomi-miio/blob/master/docs/obtain_token.md
namespace App\Home\Modules\Xiaomi;

use App\Services\IO\Xiaomi\Request;

class VacuumCleaner {

	const IP = '192.168.1.66';
	const TOKEN = '715037584d76735672353238596c4b50';

	//mirobo --ip 192.168.1.66 --token 715037584d76735672353238596c4b50 start

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
