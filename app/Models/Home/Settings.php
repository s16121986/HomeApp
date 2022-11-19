<?php

namespace App\Models\Home;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Settings extends Model {

	protected $primaryKey = false;

	public $incrementing = false;

	public $timestamps = false;

	protected $table = 'home_settings';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'name',
		'value',
	];

}
