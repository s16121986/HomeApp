<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel {

	/**
	 * The application's global HTTP middleware stack.
	 *
	 * These middleware are run during every request to your application.
	 *
	 * @var array
	 */
	protected $middleware = [
		// \App\Http\Site\Middleware\TrustHosts::class,
		\App\Http\Site\Middleware\TrustProxies::class,
		\Fruitcake\Cors\HandleCors::class,
		\App\Http\Site\Middleware\PreventRequestsDuringMaintenance::class,
		\Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
		\App\Http\Site\Middleware\TrimStrings::class,
		\Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
	];

	/**
	 * The application's route middleware groups.
	 *
	 * @var array
	 */
	protected $middlewareGroups = [
		'web' => [
			\App\Http\Site\Middleware\EncryptCookies::class,
			//\Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
			\Illuminate\Session\Middleware\StartSession::class,
			\Illuminate\View\Middleware\ShareErrorsFromSession::class,
			\App\Http\Site\Middleware\Authenticate::class,
		],

		'api' => [
			\App\Http\Api\Middleware\DebugMode::class,
			//'throttle:api',
			//\Illuminate\Routing\Middleware\SubstituteBindings::class,
		],
	];

	/**
	 * The application's route middleware.
	 *
	 * These middleware may be assigned to groups or used individually.
	 *
	 * @var array
	 */
	protected $routeMiddleware = [
		'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
		'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
		'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
	];

}
