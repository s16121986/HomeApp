<?php

namespace App\Models\Home;

use App\Enums\Home\DeviceGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Room extends Model {

	public $timestamps = false;

	protected $table = 'home_rooms';

	protected $casts = [
		'lights' => 'array',
	];

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'pid',
		'pin',
		'code',
		'key',
		'name',
		'index',
		'enabled',
		'main',
		'lights'
	];

	public static function home() {
		return static::whereNull('home_rooms.pid')->first();
	}

	public static function rooms() {
		return static::whereNotNull('home_rooms.pid')->orderBy('home_rooms.index')->get();
	}

	protected static function boot() {
		parent::boot();

		static::addGlobalScope('main', function (Builder $builder) {
			$builder
				->addSelect('home_rooms.*',
					DB::raw('EXISTS(SELECT 1 FROM home_devices d'
						. ' INNER JOIN home_device_types t ON t.id=d.type_id'
						. ' WHERE room_id=home_rooms.id'
						. ' AND d.enabled=1'
						. ' AND d.group=' . DeviceGroup::LIGHT
						. ' AND d.state=1) as light_state'));
		});
	}

	public function __toString(): string {
		return (string)$this->name;
	}

	public function devices() {
		return $this->hasMany(Device::class);
	}

	public function lightState(): int {
		return Device::whereEnabled()
			->whereIsLight()
			->where('home_devices.state', 1)
			->exists() ? 1 : 0;
	}

	public function updateLights() {
		$lights = $this->devices()
			->whereIsLight()
			->whereActive()
			->pluck('id');

		if (empty($lights))
			$lights = $this->devices()
				->whereIsLight()
				->whereDefault()
				->pluck('id');

		$this->update(['lights' => $lights]);
	}

}
