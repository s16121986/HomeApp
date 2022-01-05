<?php
namespace App\Model\Port;

use App;
use Db;
use stdClass;
use IO;

class PortDaemon{

	private $port;

	public function __construct(Port $port) {
		$this->port = $port;
	}

	public function __get($name) {
		switch ($name) {
			case 'portId': return (int)$this->port->id;
			case 'processId': return $this->port->process_pid;
		}
		return null;
	}

	public function start() {
		if ($this->isStarted())
			return;
		//die('start');
		$comPort = $this->port->getCom();
		if (!$comPort->ping())
			return;

		$this->port->write(['process_pid' => posix_getpid()]);

		$self = $this;

		Db::$shutdownDisctonnect = false;

		set_time_limit(0);
		ignore_user_abort(true);

		register_shutdown_function(function() use ($self) {
			$self->stop();
			Db::getAdapter()->disconnect();
			/*$error = error_get_last();
			if (isset($error) && $error) {
				if ($error['type'] == E_ERROR || $error['type'] == E_PARSE || $error['type'] == E_COMPILE_ERROR || $error['type'] == E_CORE_ERROR) {

				}
			}*/
		});

		while ($this->isActual()) {
			while ($input = $comPort->read()) {
				if (is_string($input)) {
					self::readInput($this->portId, $input);
				} else {
					//throw new Exception('read error: ' . $r);
				}
			}
			sleep(1);
		}

		$this->stop();
	}

	public function stop() {
		if ($this->isActual()) {
			//posix_kill((int)$this->processId, 0);
			$pid = (int)$this->processId;
			$this->port->getCom()->close();
			$this->port->write(['process_pid' => null]);
			exec('kill ' . $pid);
		}
	}

	public function isStarted() {
		return (bool)$this->processId;
	}

	public function isActual() {
		return $this->port->getCom()->ping()
				&& $this->processId
				&& (bool)Db::query('SELECT 1 FROM serial_port'
					. ' WHERE id=' . $this->portId
					. ' AND process_pid=' . (int)$this->processId)->fetchColumn();
	}

	private static function readInput($portId, $input) {
		$data = null;
		$type = null;
		switch (self::byte($input, 0)) {
			case IO::EVENT_BIT:
				$type = 'event';
				$data = new stdClass();
				$data->pin = self::byte($input, 1);
				$data->event = self::byte($input, 2);
				$data->data = self::byte($input, 3);
				App::event($data);
				break;
			case IO::STATE_BIT:
				$type = 'state';
				$data = new stdClass();
				$data->pin = self::byte($input, 1);
				$data->state = self::byte($input, 2);
				$data->data = self::byte($input, 3);
				App::state($data);
				break;
			/*case 61: //data
				$pckg = new \stdClass();
				$pckg->id = self::pckg_val($r[1]);
				$pckg->type = self::pckg_val($r[2]);
				$pckg->data = self::pckg_val($r[3]);
				return $pckg;*/
			//default: throw new Exception('pckg invalid: ' . $r);
		}
		self::log($portId, $type, $input, $data ? json_encode($data) : null);
	}

	private static function byte($data, $i) {
		if (isset($data[$i])) {
			return ord($data[$i]);
			//return ($value === 255 ? 0 : $value);
		}
		return 0;
	}

	private static function log($portId, $type, $s, $data = null) {
		Db::insert('serial_port_log', [
			'port_id' => $portId,
			'type' => $type,
			'input' => $s,
			'data' => $data
		]);
	}

}
