<?php
/**
 * http://www.linuxlib.ru/manpages/STTY.1.shtml
 * https://wirenboard.com/wiki/Modbus-client
 * https://wirenboard.com/wiki/Протокол_Modbus
 */

namespace App\Services\IO\Modbus;

class Request {

	const FN_CODE_READ_COILS = 0x01; //Чтение значений нескольких регистров флагов
	const FN_CODE_READ_DISCRETE_INPUTS = 0x02; //Чтение значений нескольких дискретных входов
	const FN_CODE_READ_HOLDING_REGISTERS = 0x03; //Чтение значений нескольких регистров хранения
	const FN_CODE_READ_INPUT_REGISTERS = 0x04; //Чтение значений нескольких регистров ввода
	const FN_CODE_WRITE_SINGLE_COIL = 0x05; //Запись одного регистра флагов
	const FN_CODE_WRITE_SINGLE_REGISTER = 0x06; //Запись одного регистра хранения
	const FN_CODE_WRITE_MULTIPLE_COILS = 0x0F; //Запись нескольких регистров флагов
	const FN_CODE_WRITE_MULTIPLE_REGISTER = 0x10; //Запись нескольких регистров хранения

	const PROTOCOL_RTU = 'rtu';
	const PROTOCOL_TCP = 'tcp';

	protected $portOptions = [
		'port' => '/dev/RS485',
		'protocol' => self::PROTOCOL_RTU,
		'parity' => 'none',
		'stopBit' => 2,
		'sendBit' => 8,
		'boudRate' => 9600
	];

	protected $address = 0;
	protected $function = 0;
	protected $register = 0;
	protected $count = 0;
	protected $data = [];

	public function __get($name) {
		return isset($this->portOptions[$name]) ? $this->portOptions[$name] : null;
	}

	public function setAddress($address) {
		return $this->set('address', $address);
	}

	public function setFunction($code) {
		return $this->set('function', $code);
	}

	public function setRegister($register) {
		return $this->set('register', $register);
	}

	public function setCount($count) {
		return $this->set('count', $count);
	}

	public function setData($data) {
		if (!is_array($data))
			$data = [$data];
		if (count($data) > 1)
			$this->count = count($this->data);
		$this->data = $data;

		return $this;
	}

	public function readCoils($startRegister = 0, $count = 1) {
		return $this->read(self::FN_CODE_READ_COILS, func_get_args());
	}

	public function sendCoils($register, $data) {
		return $this->write(self::FN_CODE_WRITE_SINGLE_COIL, $register, $data);
	}

	public function readHoldingRegisters($startRegister = 0, $count = 1) {
		return $this->read(self::FN_CODE_READ_HOLDING_REGISTERS, $startRegister, $count);
	}

	public function sendHolding($register, $data) {
		return $this->write(self::FN_CODE_WRITE_SINGLE_REGISTER, $register, $data);
	}

	public function readDiscreteInputs($startRegister = 0, $count = 1) {
		return $this->read(self::FN_CODE_READ_DISCRETE_INPUTS, $startRegister, $count);
	}

	public function readInputRegisters($startRegister = 0, $count = 1) {
		return $this->read(self::FN_CODE_READ_INPUT_REGISTERS, $startRegister, $count);
	}

	public function sendMultipleCoils($register, array $data) {
		return $this->write(self::FN_CODE_WRITE_MULTIPLE_COILS, $register, $data);
	}

	public function sendMultipleHolding($register, array $data) {
		return $this->write(self::FN_CODE_WRITE_MULTIPLE_REGISTER, $register, $data);
	}

	protected function read($function, $startRegister, $count) {
		return $this
			->setFunction($function)
			->setRegister($startRegister)
			->setCount($count)
			->send();
	}

	protected function write($function, $register, $data) {
		return $this
			->setFunction($function)
			->setRegister($register)
			->setData($data)
			->send();
	}

	protected function send() {
		//return true;
		//modbus_client --debug -mrtu -pnone -s2 /dev/ttyRS485-1 -a1 -t0x05 -r0x05 0x01

		$cmd = 'modbus_client';

		if ($this->debug)
			$cmd .= ' --debug';

		$cmd .= ' -m' . $this->protocol; //определяет тип используемого протокола

		switch ($this->protocol) {
			case self::PROTOCOL_RTU:
				$cmd .= ' -b' . $this->boudRate; //скорость передачи данных по последовательной линии
				$cmd .= ' -d' . $this->sendBit; //количество передаваемых бит данных (7 или 8, по умолчанию — 8).
				$cmd .= ' -p' . $this->parity; //контроль четности
				$cmd .= ' -s' . $this->stopBit; //количество стоповых битов (1 или 2, по умолчанию — 1).
				break;
			case self::PROTOCOL_TCP:

				break;
		}

		$cmd .= ' ' . $this->port;

		if ($this->count)
			$cmd .= ' -c' . $this->count; //определяет, какое количество элементов мы запрашиваем. По умолчанию — один.

		$cmd .= ' -a' . self::pack($this->address);
		$cmd .= ' -t' . self::pack($this->function); //указывает код функции Modbus
		$cmd .= ' -r' . self::pack($this->register); //задает начальный адрес для чтения или записи

		foreach ($this->data as $d) {
			$cmd .= ' ' . self::pack($d);
		}
		//var_dump($cmd);
		//return new Response('', ['command' => $cmd]);

		//$response = 1;
		return new Response(shell_exec($cmd), ['command' => $cmd]);
	}

	protected function set($name, $data) {
		$this->$name = $data;
		return $this;
	}

	protected static function pack($data) {
		return '0x' . dechex($data);
	}

}
