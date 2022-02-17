<?php

namespace App\Services\IO\Modbus;

use App\Services\IO\SerialTool\Request as Base;

class Client extends Base {

	public function crc16($data) {
		$crc = 0xFFFF;
		for ($i = 0; $i < strlen($data); $i++) {
			$crc ^= ord($data[$i]);
			for ($j = 8; $j != 0; $j--) {
				if (($crc & 0x0001) != 0) {
					$crc >>= 1;
					$crc ^= 0xA001;
				} else
					$crc >>= 1;
			}
		}
		$highCrc = floor($crc / 256);
		$lowCrc = ($crc - $highCrc * 256);
		return chr($lowCrc) . chr($highCrc);
	}

	public function send() {

	}

}
