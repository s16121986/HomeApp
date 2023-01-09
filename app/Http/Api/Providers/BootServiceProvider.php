<?php

namespace App\Http\Api\Providers;

use App\Enums\AppSource;
use Illuminate\Support\ServiceProvider;

class BootServiceProvider extends ServiceProvider {

	private $providers = [
		RouteServiceProvider::class
	];

	public function register() {
		$this->app->instance('appSource', AppSource::API);

		foreach ($this->providers as $provider) {
			$this->app->register($provider);
		}
	}

}
