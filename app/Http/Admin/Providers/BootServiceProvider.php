<?php

namespace App\Http\Admin\Providers;

use App\Enums\AppSource;
use Illuminate\Support\ServiceProvider;

class BootServiceProvider extends ServiceProvider {

	private $providers = [
		ViewServiceProvider::class,
		RouteServiceProvider::class
	];

	public function register() {
		$this->app->instance('appSource', AppSource::ADMIN_PANEL);

		foreach ($this->providers as $provider) {
			$this->app->register($provider);
		}
	}

}
