<?php

namespace App\Models\Scenario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Action extends Model {

	public $timestamps = false;

	protected $table = 'scenario_actions';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'parent',
		'parent_id',
		'entity',
		'entity_id',
		'event',
		'name',
		'command',
		'data',
		'enabled',
	];

	public function parent() {
		return $this->parent ? $this->parent::find($this->parent_id) : null;
	}

	public function isParent($parent): bool {
		return $this->parent === $parent::class && $this->parent_id === $parent->id;
	}

	public function conditions() {
		return $this->hasMany(Condition::class)->get();
	}

	public function commands() {
		return $this->hasMany(Command::class)->get();
	}

	public function __toString(): string {
		return (string)$this->name;
	}

	public static function scopeWhereEnabled($query) {
		$query->where('scenario_actions.enabled', true);
	}

	public static function scopeWhereEvent($query, $event) {
		$query->where('scenario_actions.event', $event::class);
	}

	public static function scopeWhereParent($query, $entity) {
		if ($entity)
			$query
				->where('scenario_actions.parent', $entity::class)
				->where('scenario_actions.parent_id', $entity->id);
		else
			$query
				->whereNull('scenario_actions.parent')
				->whereNull('scenario_actions.parent_id');
	}

	public static function scopeWhereEntity($query, $entity) {
		$query
			->where('scenario_actions.entity', $entity::class)
			->where('scenario_actions.entity_id', $entity->id);
	}

}
