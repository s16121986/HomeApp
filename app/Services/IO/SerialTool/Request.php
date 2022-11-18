<?php

namespace App\Services\IO\SerialTool;

class Request {

	const SCRIPT = '/usr/lib/serial_tool/serial_tool.py';

	protected $portOptions = [
		'port' => '/dev/RS485',
		'parity' => null,   //контроль четности, default=N
		'dataBits' => null, //количество передаваемых бит данных (7 или 8, по умолчанию — 8), default=8
		'stopBits' => null, //default=1
		'timeout' => null,  //default=0.1
		'baud' => null,     //скорость передачи данных по последовательной линии, default=9600
		'debug' => false
	];

	public function __construct(array $options = []) {
		foreach ($options as $k => $v) {
			$this->portOptions[$k] = $v;
		}
	}

	public function __get($name) {
		return $this->portOptions[$name] ?? null;
	}

	public function send() {
		$cmd = self::SCRIPT;

		if ($this->debug)
			$cmd .= ' --debug';

		//$cmd .= ' --raw';
		$cmdArgs = [
			'b' => 'baud',
			'p' => 'parity',
			's' => 'stopBits',
			'd' => 'dataBits',
			't' => 'timeout'
		];
		foreach ($cmdArgs as $arg => $param) {
			if (null !== $this->$param)
				$cmd .= ' -' . $arg . $this->$param;
		}

		$cmd .= ' ' . $this->port;

		$cmd .= ' -x "' . self::pack(func_get_args()) . '"';

		//\DB::table('api_log')->insert(['request' => $cmd]);
		//dd($cmd);

		return new Response(shell_exec($cmd));
	}

	protected static function pack(array $data) {
		if (is_string($data[0]))
			return $data[0];

		$a = [];
		foreach ($data as $d) {
			if (null === $d)
				continue;
			$a[] = str_pad(dechex($d), 2, '0', STR_PAD_LEFT);
		}

		return join(' ', $a);
	}

}
