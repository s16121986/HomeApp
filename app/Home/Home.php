<?php

namespace App\Home;

use App\Models\Home\Device;
use App\Models\Home\Sensors;
use App\Models\Home\Settings;
use App\Repositories\HomeRepository;
use App\Home\Commands\HomeCommands;
use stdClass;

class Home {

	private static $instance;

	private $home;

	private $devices;

	private $rooms;

	private $sensorsData;

	private $settings;

	private $commands;

	public static function getInstance(): Home {
		return self::$instance ?? self::$instance = new Home();
	}

	/*public static function __callStatic(string $name, array $arguments) {
		return call_user_func_array([self::getInstance(), $name], $arguments);
	}*/


	protected function __construct() {
		$this->home = HomeRepository::home();
		$this->commands = new HomeCommands();
	}

	public function __get(string $name) {
		return $this->home->$name;
	}

	public function __call(string $name, array $arguments) {
		call_user_func_array([$this->commands, $name], $arguments);
	}

	public function command($command, $data = null) {
		return $this->commands->command($command, $data);
	}

	public function device($id) {
		if (isset($this->devices[$id]))
			return $this->devices[$id];

		return $this->devices[$id] = DeviceFactory::find($id);
	}

	public function rooms(): array {
		if (null !== $this->rooms)
			return $this->rooms;

		$this->rooms = [];

		foreach (HomeRepository::rooms() as $room) {
			$this->rooms[] = new Room($room);
		}

		return $this->rooms;
	}

	public function room(int $id): ?Room {
		foreach (self::rooms() as $room) {
			if ($room->id === $id)
				return $room;
		}

		return null;
	}

	public function settings(): stdClass {
		if (null !== $this->settings)
			return $this->settings;

		$this->settings = new stdClass();
		foreach (Sensors::get() as $r) {
			$this->settings->{$r->name} = $r->value;
		}

		return $this->settings;
	}

	public function sensors(): stdClass {
		if (null !== $this->sensorsData)
			return $this->sensorsData;

		$this->sensorsData = new stdClass();
		foreach (Sensors::get() as $r) {
			$this->sensorsData->{$r->name} = $r->value;
		}

		return $this->sensorsData;
	}

	public function sensor($key) {
		return $this->sensors()->$key;
	}

	public function getDaytime() {
		return $this->sensors()->daytime;
	}

	public function hasActiveLights() {
		return Device::query()
			->whereIsLight()
			->whereActive()
			->exists();
	}

}
