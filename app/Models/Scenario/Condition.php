<?php

namespace App\Models\Scenario;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Condition extends Model {

	protected $primaryKey = false;

	public $incrementing = false;

	public $timestamps = false;

	protected $table = 'scenario_conditions';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'type',
		'device_id',
		'value',
		'type',
	];

}
