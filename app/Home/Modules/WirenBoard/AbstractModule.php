<?php
/**
 *
 */

namespace App\Home\Modules\WirenBoard;

use App\Services\IO\Modbus\Request as ModbusRequest;

abstract class AbstractModule {

	const REGISTER_ADDRESS = 128;

	protected $address;

	public function __construct($address) {
		$this->address = $address;
	}

	public function __get($name) {
		switch ($name) {
			case 'address':
				return $this->address;
		}
	}

	public function ___call($name, $arguments) {
		array_unshift($arguments, $name);
		return call_user_func_array([$this, 'execute'], $arguments);
	}

	public function setAddress($address) {
		return $this->sendHolding(self::REGISTER_ADDRESS, $address);
	}

	public function getAddress() {
		return $this->readHolding(self::REGISTER_ADDRESS);
	}

	protected function getRequest(): ModbusRequest {
		$request = new ModbusRequest();
		$request->setAddress($this->address);

		return $request;
	}

	protected function sendCoils($register, $data) {
		return $this->send('sendCoils', [$register, $data]);
	}

	protected function readCoils($register) {
		return $this->send('readCoils', [$register]);
	}

	protected function readHolding($register) {
		return $this->send('readHoldingRegisters', [$register]);
	}

	protected function sendHolding($register, $data) {
		return $this->send('sendHolding', [$register, $data]);
	}

	protected function readDiscreteInputs($register) {
		return $this->send('readInputs', [$register]);
	}

	protected function readInputRegisters($register) {
		return $this->send('readInputRegisters', [$register]);
	}

	protected function send($method, $arguments) {
		$request = $this->getRequest();

		return call_user_func_array([$request, $method], $arguments);
	}

}
