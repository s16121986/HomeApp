<?php

namespace App\Models\Oauth;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;

class Token extends Model {

	const CREATED_AT = 'created';
	const UPDATED_AT = null;

	public $timestamps = true;

	protected $table = 'oauth_tokens';

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var string[]
	 */
	protected $fillable = [
		'client_id',
		'state',
		'code',
		'token',
	];

	private static function generate($length): string {
		static $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
		$password = '';
		$l = strlen($chars) - 1;
		for ($i = 0; $i < $length; $i++) {
			$password .= substr($chars, rand(0, $l), 1);
		}

		return $password;
	}

	public static function findByCode($code) {
		return static::where('code', $code)->first();
	}

	public static function findByToken($token) {
		return static::where('token', $token)->first();
	}

	public function token(): Token {
		$token = Token::where('client_id', $this->id);

		if (!$token)
			$token = Token::create([
				'client_id' => $this->id
			]);

		return $token;
	}

	public function setState($state) {
		return $this->update(['state' => $state]);
	}

	public function generateCode(): string {
		$code = self::generate(20);
		$this->update(['code' => $code]);

		return $code;
	}

	public function generateToken(): string {
		$code = self::generate(45);
		$this->update(['token' => $code]);
		return $code;
	}

	public function getAuthData() {
		return [
			'access_token' => $this->token,
			'token_type' => 'bearer',
			'state' => $this->state
			//'expires_in' => 86400,
			//'refresh_token' => '8xLOxBtZp8',
		];
	}

	public function __toString() {
		return json_encode($this->getAuthData());
	}

}
