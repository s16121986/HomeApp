<?php

namespace App\Http\Site\Middleware;

use Cookie;
use Closure;
use Illuminate\Http\Response;

class Authenticate {

	const COOKIE_NAME = 'app-auth-hash';
	const AUTH_HASH = '8d7af8dfea80e72cbbfd1afa317539d0914e82636dfdd5e3c2f76cf133831c547358e7ef7b9e3a3d5a8a17d2226faec90aad6b53c39f8f3d9c8027b24406f566';

	public function handle($request, Closure $next) {
		//$hash = $request->get(self::COOKIE_NAME);
		$hash = Cookie::get(self::COOKIE_NAME);
		//dd($request->ip());
		if ($hash === self::AUTH_HASH)
			return $next($request);

		$flag = false;
		$ip = $request->ip();
		foreach (explode(';', env('ALLOWED_IP')) as $s) {
			if (str_starts_with($ip, $s)) {
				$flag = true;
				break;
			}
		}
		//dd($ip, $allowed, in_array($ip, $allowed));
		if (!$flag)
			return abort(403);

		$cookie = Cookie::forever(self::COOKIE_NAME, self::AUTH_HASH);
		$response = $next($request);
		$response->withCookie($cookie);

		return $response;
	}

}
