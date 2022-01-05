<?php

namespace App\Home\Modules\Other;

use App\Services\IO\SerialTool\Request as SerialTool;

class ProjectorScreen {

	private static array $portOptions = [
		'baud' => 2400,
		'parity' => 'N',
		'stopBits' => 1,
		'dataBits' => 8
	];

	const CODE_OPEN = 0xEE;
	const CODE_STOP = 0xCC;
	const CODE_CLOSE = 0xDD;

	public function open() {
		return self::send(self::CODE_OPEN);
	}

	public function stop() {
		return self::send(self::CODE_STOP);
	}

	public function close() {
		return self::send(self::CODE_CLOSE);
	}

	private static function send($command) {
		$serial = new SerialTool(self::$portOptions);
		return $serial->send(0xFF, 0xAA, 0xEE, 0xEE, $command);
	}

}
