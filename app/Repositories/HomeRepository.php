<?php

namespace App\Repositories;

use App\Models\Home\Device;
use App\Models\Home\Module;
use App\Models\Home\Room;
use App\Models\Scenario\Scenario;

class HomeRepository {

	private static $home;

	private static $rooms;

	private static function _rooms() {
		if (self::$home)
			return;

		self::$rooms = [];

		$rooms = Room::get();
		foreach ($rooms as $room) {
			if ($room->pid)
				self::$rooms[] = $room;
			else
				self::$home = $room;
		}
	}

	public static function home() {
		self::_rooms();

		return self::$home;
	}

	public static function rooms() {
		self::_rooms();

		return self::$rooms;
	}

	public static function room($key) {
		foreach (self::rooms() as $room) {
			if ($room->key === $key)
				return $room;
		}

		return null;
	}

	public static function device($id) {
		return Device::find($id);
	}

	public static function modules() {
		return Module::get();
	}

	public static function devices() {
		return Device::whereEnabled()
			->orderBy('home_rooms.index', 'asc')
			->get();
	}

	public static function scenarios() {
		return Scenario::where('enabled', true)->get();
	}

}
