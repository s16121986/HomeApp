<?php

namespace App\Models\Scenario;

use App\Models\Concerns\TabularSection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Scenario extends Model {

	public $timestamps = false;

	protected $lights;

	protected $table = 'scenarios';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'icon',
		'name',
		'enabled',
		'active',

		'lights'
	];

	public function device() {

	}

	public function lights(): TabularSection {
		return $this->lights ?? $this->lights = new TabularSection($this, 'scenario_lights', 'device_id');
	}

	public function getLightsAttribute() {
		return $this->lights()->values();
	}

	public function setLightsAttribute($sites) {
		$this->lights()->values($sites);
	}

	public static function scopeWhereEnabled($query) {
		$query->where('scenarios.enabled', true);
	}

	public function __toString(): string {
		return (string)$this->name;
	}

}
