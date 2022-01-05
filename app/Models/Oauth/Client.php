<?php

namespace App\Models\Oauth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Client extends Model {

	const CREATED_AT = 'created';
	const UPDATED_AT = null;

	public $timestamps = true;

	protected $table = 'oauth_clients';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'client_id',
		'client_secret',
	];

	public static function findByIdentifier($id) {
		return static::where('client_id', $id)->first();
	}

	public function token(): Token {
		$token = Token::where('client_id', $this->id);

		if (!$token)
			$token = Token::create([
				'client_id' => $this->id
			]);

		return $token;
	}

}
