<?php

namespace App\Services\IO\Com;

use App\Models\Port;
use Arduino;

class ArduinoSerial {

	private static $instance;

	private $serial;

	public static function getInstance() {
		if (self::$instance)
			return self::$instance;

		$port = Port::findActive();
		if (!$port)
			return;

		return self::$instance = new self($port->port);
	}

	protected function __construct($port) {
		$this->serial = new Arduino();
		$this->serial->setPort($port);
	}

	public function ping() {
		return $this->serial->open() > 0;
	}

	public function write($startBit, $target, $action, $data = 0) {
		if (!$this->isReady())
			return false;
		return $this->serial->write(chr($startBit) . chr($target) . chr($action) . chr($data));
	}

	public function isReady() {
		return $this->serial->open() > 0;
	}

	public function close() {
		$this->serial->close();
	}

}
