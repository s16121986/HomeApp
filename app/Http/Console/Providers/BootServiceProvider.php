<?php

namespace App\Http\Console\Providers;

use App\Http\Site\Providers;
use Illuminate\Support\ServiceProvider;

class BootServiceProvider extends ServiceProvider {

	private $providers = [
		Providers\BroadcastServiceProvider::class,
		Providers\EventServiceProvider::class,
	];

	public function register() {
		foreach ($this->providers as $provider) {
			$this->app->register($provider);
		}
	}

}
