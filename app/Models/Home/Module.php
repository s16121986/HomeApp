<?php

namespace App\Models\Home;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Module extends Model {

	public $timestamps = false;

	protected $table = 'home_modules';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'room_id',
		'type',
		'address',
		'name',
		'status',
	];

	protected static function boot() {
		parent::boot();

		static::addGlobalScope('main', function (Builder $builder) {
			$builder
				->addSelect('home_modules.*',
					'home_rooms.name as room_name')
				->join('home_rooms', 'home_rooms.id', '=', 'home_modules.room_id');
		});
	}

	public function getIconClass(): ?string {

		return match (true) {
			$this->type === 'App\Home\Modules\Other\ProjectorScreen' => 'projector_screen',
			$this->type === 'App\Home\Modules\Other\DT82TV' => 'curtains',
			$this->type === 'App\Home\Modules\Xiaomi\VacuumCleaner' => 'vacuum_cleaner',
			$this->type === 'App\Home\Modules\Arduino\WC' => 'wc',
			$this->type === 'App\Home\Modules\Arduino\Warmfloor' => 'warmfloor',
			$this->type === 'App\Home\Modules\Arduino\Climatic' => 'climate',
			$this->type === 'App\Home\Modules\Arduino\Humidifier' => 'climate',
			$this->type === 'App\Home\Modules\Arduino\Gidrolock' => 'gidrolock',
			str_starts_with($this->type, 'App\Home\Modules\Arduino') => 'arduino',
			str_starts_with($this->type, 'App\Home\Modules\WirenBoard') => 'wirenboard',
			default => null,
		};
	}

	public function __toString(): string {
		return (string)$this->name;
	}

}
