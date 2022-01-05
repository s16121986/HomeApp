<?php

namespace App\Services\IO\RS485;

//use Arduino;

class Request {

	const PROTOCOL_RTU = 'rtu';
	const PROTOCOL_TCP = 'tcp';

	protected $portOptions = [
		'port' => '/dev/RS485',
		'protocol' => self::PROTOCOL_RTU,
		'parity' => 'none',
		'sendBit' => 8,
		'stopBit' => 2,
		'speed' => 9600
	];

	public function __construct(array $options = null) {
		foreach ($options as $k => $v) {
			$this->portOptions[$k] = $v;
		}
	}

	public function __get($name) {
		return $this->portOptions[$name] ?? null;
	}

	public function _send() {
		$handle = @fopen($this->port, 'r+b');

		$hexCodes = func_get_args();
		$s = '';
		foreach ($hexCodes as $code) {
			$s .= chr($code);//'\x' . strtoupper(dechex($code));
		}

		fwrite($handle, $s);

		//$content = fread($handle, 10);

		//var_dump($s, $content);

		fclose($handle);
	}

	public function send() {
		//stty -F /dev/RS485 speed 9600 cs8 cstopb parenb
		//echo -en '\xFF\xAA\xEE\xEE\xDD' > /dev/RS485 #Up

		$stty = 'stty -F ';
		$stty .= ' ' . $this->port;
		$stty .= ' speed ' . $this->speed;
		$stty .= ' cs' . $this->sendBit;
		$stty .= ' -cstopb';
		$stty .= ' -parenb';

		//$command = 'echo -en \'' . self::pack(func_get_args()) . '\' > ' . $this->port;
		$command = ROOT_PATH . '/bin/rs485.sh \'' . self::pack(func_get_args()) . '\'';

		/*$serial = new Arduino();
		$serial->setPort($this->port);
		$serial->write(self::pack(func_get_args()));

		$i = 0;
		while ($i++ < 10) {
			$input = $serial->read();
			if (!$input || !is_string($input)) {
				usleep(10);
				continue;
			}

			var_dump($input);
			break;
		}
		$response = 1;*/
		//shell_exec($stty);
		//$response = file_put_contents($this->port, $command);
		$response = shell_exec($command);
		var_dump($stty, $command, $response);
		exit;

		return $response;
	}

	protected static function pack($hexCodes) {
		$s = '';
		/*foreach ($hexCodes as $code) {
			$s .= chr($code);
		}*/
		foreach ($hexCodes as $code) {
			$s .= '\x' . strtoupper(dechex($code));
		}
		return $s;
	}

}
