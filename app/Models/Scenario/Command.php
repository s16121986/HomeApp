<?php

namespace App\Models\Scenario;

use App\Models\Home\Device;
use App\Models\Home\Room;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Command extends Model {

	public $timestamps = false;

	protected $table = 'scenario_commands';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'action_id',
		'entity',
		'entity_id',
		'command',
		'data',
	];

	public function entity() {
		switch ($this->entity) {
			case 'App\Home\Home':
				return home();
			case Device::class:
				return Device::find($this->entity_id);
			case Room::class:
				return Room::find($this->entity_id);
			case Scenario::class:
				return Scenario::find($this->entity_id);
		}
	}

}
