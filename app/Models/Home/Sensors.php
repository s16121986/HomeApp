<?php

namespace App\Models\Home;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Sensors extends Model {

	protected $primaryKey = false;

	public $incrementing = false;

	public $timestamps = false;

	protected $table = 'home_sensors';

	protected $fillable = [
		'name',
		'value',
	];

}
