<?php

namespace App\Providers;

use App\Contracts\DomainServiceProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register() {
		if ($this->app->has(DomainServiceProvider::class))
			$this->app->register($this->app->get(DomainServiceProvider::class));
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot() {
		date_default_timezone_set('europe/moscow');
	}

}
