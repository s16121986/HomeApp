<?php

namespace App\Http\Api\Middleware;

use App\Models\Oauth\Token;
use Closure;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

class YandexAuth {

	/**
	 * Handle an incoming request.
	 *
	 * @param \Illuminate\Http\Request $request
	 * @param \Closure $next
	 * @return mixed
	 */
	public function handle($request, Closure $next, $role = null) {
		/*$administrator = Auth::user();
		if (!$administrator->access()->hasRole($role))
			return abort(403);*/
		//dd($route->getName());
		//if ($route && false === $config->isRouteAllowed($route->getName()))

		if (!$this->authentication($request))
			return abort(403);

		$request->attributes->add(['requestId' => $request->header('X-Request-Id')]);

		return $next($request);
	}

	private function authentication($request): bool {
		$authHeader = $request->header('Authorization');
		//$authHeader = 'Bearer nnJamOE2ABf8TsRmdk3KhsvJaeK5AkDQl6aQ4SCZuaeOU';
		if (!$authHeader)
			return false;

		if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches))
			return false;

		$authCode = $matches[1];

		$authToken = Token::findByToken($authCode);
		if (!$authToken)
			return false;

		$request->attributes->add([
			'userId' => (string)$authToken->client_id,
			'token' => $authToken
		]);

		return true;
	}

}
