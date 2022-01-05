<?php

namespace App\Home\Modules\Other;

use App\Services\IO\Modbus\Util\CRC16;
use App\Services\IO\SerialTool\Request as SerialTool;

class DT82TV {

	private static $portOptions = [
		'baud' => 9600,
		'parity' => 'N',
		'stopBits' => 1,
		'dataBits' => 8
	];

	const BIT_START = 0x55;
	const BIT_ADDRESS = 0xFEFE;

	public function open() {
		//open  55 FE FE 03 01 B9 24
		return self::send(0x03, 0x01, 0xB9, 0x24);
	}

	public function close($percent = null) {
		//close 55 fe fe 03 02 f9 25
		//if (null === $percent)
		return self::send(0x03, 0x02, 0xf9, 0x25);
		//else
		//	return self::send(self::BIT_CONTROL, 0x04, $percent);
	}

	public function stop() {
		//stop  55 FE FE 03 03 38 E5
		return self::send(0x03, 0x03, 0x38, 0xe5);
	}

	public function position() {
		//read 0x55, 0xfe, 0xFE, 0x01, 0x02, 0x01, 0x85, 0x42
		$s = chr(0x55) .
			chr(0xFEFE) . chr(0x03) . chr(0x01);// . chr(0x00) . chr(0x00);
		$x = CRC16::calculate($s);
		var_dump($s, dechex($x));
		exit;
		$response = $this->send(0x01, 0x02, 0x01, 0x85, 0x42);
		var_dump($response->get(5));
		return $response;
	}

	private static function send() {
		$serial = new SerialTool(self::$portOptions);
		$sendBytes = [];
		$sendBytes[] = self::BIT_START;
		$sendBytes[] = 0xfe;
		$sendBytes[] = 0xfe;
		foreach (func_get_args() as $byte) {
			$sendBytes[] = $byte;
		}
		return call_user_func_array([$serial, 'send'], $sendBytes);
		/*$serial->send(0x55, 0xfe, 0xFE, 0x01, 0x02, 0x01, 0x85, 0x42);//read
		$s = chr(0x55) . chr(0xFE) . chr(0xFE) . chr(0x03) . chr(0x01);
		var_dump($s);
		$x = CRC16::calculate($s);
		var_dump(dechex($x));exit;
		return $serial->send(0x55, 0xFE, 0xFE, 0x03, 0x01, 0xB9, 0x24);//open
		return $serial->send(0x55, 0x02, 0xFE, 0x03, 0x01, 0x88, 0x88);//close
		//return $serial->send(0x55, 0x02, 0xFE, 0x03, 0x02, 0xC9, 0x75);
		//return $serial->send(0x55, 0x12, 0x34, 0x03, 0x01, 0xAD, 0x8A);

		$serial = new Modbus(self::$portOptions);

		return $serial->send(self::BIT_START, 0x02, 0xFE, self::BIT_CONTROL, self::BIT_CLOSE);
		$response = $serial->send(self::BIT_START, 0x02, 0xFE, $functionBit, $commandBit, $dataBit);

		static $sh = SH_PATH . DIRECTORY_SEPARATOR . 'projector_screen.sh';
		$response = shell_exec($sh . ' ' . $command);
		//var_dump($response, $command);

		return $response;*/
	}

}
