<?php

namespace App\Models\Home;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Sensors extends Model {

	const CREATED_AT = null;

	const UPDATED_AT = 'updated';

	protected $primaryKey = false;

	public $incrementing = false;

	public $timestamps = true;

	protected $table = 'home_sensors';

	protected $fillable = [
		'name',
		'value',
	];

	public static function value($name) {
		return static::where('name', $name)->value('value');
	}

}
