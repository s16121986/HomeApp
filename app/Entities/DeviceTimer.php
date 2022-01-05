<?php

namespace App\Entities;

use App\Home\DeviceFactory;
use App\Enums\System\DeviceTimerType;
use Illuminate\Support\Facades\DB;

class DeviceTimer {

	private static $table = 's_device_timers';
	private $device;
	private $timeout;
	private $type;

	public function __construct($device) {
		if (is_numeric($device))
			$device = DeviceFactory::find($device);

		$this->device = $device;
	}

	public function device() {
		return $this->device;
	}

	public function start($timeout, $type = null) {
		if ($this->find()) {
			DB::table(self::$table)
				->where('device_id', $this->device->id)
				->update(['timeout' => $timeout, 'type' => $type]);
		} else {
			DB::table(self::$table)
				->insert([
					'device_id' => $this->device->id,
					'timeout' => $timeout,
					'type' => $type
				]);
		}
	}

	public function update($timeout, $type = null): bool {
		if ($this->find() && $this->timeout > $timeout)
			return false;

		$this->start($timeout, $type);

		return true;
	}

	public function timeout($timeout): bool {
		if ($this->findByType(DeviceTimerType::OFF_DELAY))
			return false;

		return $this->update($timeout, DeviceTimerType::TIMEOUT);
	}

	public function off($offDelay = 10) {
		if ($offDelay)
			$this->start($offDelay, DeviceTimerType::OFF_DELAY);
		else
			$this->stop();
	}

	public function stop() {
		$this->unset();
	}

	public function isStarted(): bool {
		return $this->find();
	}

	public function isExpired(): bool {
		return $this->timeout <= 0;
	}

	public function unset() {
		if (!$this->find())
			return;

		DB::table(self::$table)
			->where('device_id', $this->device->id)
			->delete();
	}

	public function find(): bool {
		if (null !== $this->timeout)
			return true;

		$data = DB::table(self::$table)
			->where('device_id', $this->device->id)
			->first();
		if (!$data)
			return false;

		$this->timeout = (int)$data->timeout;
		$this->type = (int)$data->type;

		return true;
	}

	public function findByType($type): bool {
		return $this->find() && $this->type == $type;
	}

}
