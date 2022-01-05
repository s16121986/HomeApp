<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Port extends Model {

	public $timestamps = false;

	protected $table = 'serial_port';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'port',
		'active',
		'status',
		'process_pid',
	];

	public static function findActive() {
		return static::whereActive()->first();
	}

	public static function scopeWhereActive($builder) {
		$builder->where('active', 1);
	}

}
