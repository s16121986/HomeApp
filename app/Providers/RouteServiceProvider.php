<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider {

	/**
	 * The path to the "home" route for your application.
	 *
	 * This is used by Laravel authentication to redirect users after login.
	 *
	 * @var string
	 */
	public const HOME = '/home';

	/**
	 * The controller namespace for the application.
	 *
	 * When present, controller route declarations will automatically be prefixed with this namespace.
	 *
	 * @var string|null
	 */
	// protected $namespace = 'App\\Http\\Controllers';

	/**
	 * Define your route model bindings, pattern filters, etc.
	 *
	 * @return void
	 */
	public function boot() {
		Route::pattern('id', '[0-9]+');

		switch (APP_SCRIPT) {
			case 'web_home':
				return $this->mapWebRoutes('site');
			case 'web_admin':
				return $this->mapAdminRoutes();
			case 'web_api':
				return $this->mapApiRoutes();
			default:
				$this->routes(function () { });
		}
	}

	private function mapAdminRoutes() {
		return $this->mapWebRoutes('admin');
	}

	private function mapWebRoutes($sub) {
		$this->routes(function () use ($sub) {
			Route::middleware('web')
				->namespace($this->namespace)
				->group(base_path('routes/' . $sub . '.php'));
		});
	}

	private function mapApiRoutes() {
		$this->routes(function () {
			Route::middleware('api')
				->namespace($this->namespace)
				->group(base_path('routes/api.php'));
		});
	}

	/**
	 * Configure the rate limiters for the application.
	 *
	 * @return void
	 */
	protected function configureRateLimiting() {
		RateLimiter::for('api', function (Request $request) {
			return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
		});
	}

}
