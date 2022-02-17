<?php

namespace App\Models\Home;

use App\Enums\Home\DeviceGroup;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Device extends Model {

	const UPDATED_AT = 'updated';
	const CREATED_AT = 'created';

	public $timestamps = true;

	protected $table = 'home_devices';

	protected $casts = [
		'data' => 'array'
	];

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'room_id',
		'type_id',
		'module_id',
		'group',
		'channel',
		'icon',
		'image',
		'key',
		'name',
		'ya_enabled',
		'ya_name',
		'enabled',
		'default',
		'favorite',
		'main',
		'usable',
		'timeout',
		'state',
		'data',
		'default_data',
	];

	public static function findByPin($pin) {
		return static::where('home_devices.channel', $pin)->first();
	}

	protected static function boot() {
		parent::boot();

		static::addGlobalScope('main', function (Builder $builder) {
			$builder
				->addSelect('home_devices.*',
					'home_rooms.name as room_name',
					'home_rooms.key as room_key',
					'home_modules.address',
					'home_modules.name as module_name',
					'home_modules.type as module_type',
					'home_device_types.key as type',
					//'home_device_types.group',
					'home_device_types.name as type_name')
				->join('home_rooms', 'home_rooms.id', '=', 'home_devices.room_id')
				->join('home_modules', 'home_modules.id', '=', 'home_devices.module_id')
				->join('home_device_types', 'home_device_types.id', '=', 'home_devices.type_id');
		});
	}

	public function __toString(): string {
		return (string)$this->name;
	}

	public function isLight(): bool {
		return $this->group == DeviceGroup::LIGHT;
	}

	public function room() {
		return Room::find($this->room_id);
	}

	public static function scopeWhereEnabled(Builder $builder) {
		$builder->where('home_devices.enabled', 1);
	}

	public static function scopeWhereDefault(Builder $builder) {
		$builder->where('home_devices.default', 1);
	}

	public static function scopeWhereIsLight(Builder $builder) {
		$builder->where('home_devices.group', DeviceGroup::LIGHT);
	}

	public static function scopeWhereActive(Builder $builder) {
		$builder->where('home_devices.state', 1);
	}

	public static function scopeWhereRoom(Builder $builder, $room) {
		$builder->where('home_devices.room_id', $room->id);
	}

	public static function scopeWherePin(Builder $builder, $pin) {
		$builder->where('home_devices.channel', $pin);
	}

	public static function scopeWhereRoomKey(Builder $builder, $key) {
		$builder->where('home_rooms.key', $key);
	}

}
