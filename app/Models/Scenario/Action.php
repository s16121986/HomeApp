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
		return $this->parent::find($this->parent_id);
	}

	public function entity() {
		return $this->entity::find($this->entity_id);
	}

	public function isParent($parent): bool {
		return $this->parent === $parent::class && $this->parent_id === $parent->id;
	}

	public function isEntity($entity): bool {
		return $this->entity === $entity::class && $this->entity_id === $entity->id;
	}

	public function conditions() {
		return $this->hasMany(Condition::class)->get();
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
		$query
			->where('scenario_actions.parent', $entity::class)
			->where('scenario_actions.parent_id', $entity->id);
	}

	public static function scopeWhereEntity($query, $entity) {
		$query
			->where('scenario_actions.entity', $entity::class)
			->where('scenario_actions.entity_id', $entity->id);
	}

}
