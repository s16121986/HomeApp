<?php

namespace App\Http\Site\Providers;

use App\Enums\AppSource;
use Illuminate\Support\ServiceProvider;

class BootServiceProvider extends ServiceProvider {

	private $providers = [
		BroadcastServiceProvider::class,
		EventServiceProvider::class,
		RouteServiceProvider::class,
		ViewServiceProvider::class
	];

	public function register() {
		$this->app->instance('appSource', AppSource::WEB);

		foreach ($this->providers as $provider) {
			$this->app->register($provider);
		}
	}

}
