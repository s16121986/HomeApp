<?php

namespace App\Http\Admin\Providers;

use App\Http\Admin\View\Layout;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class ViewServiceProvider extends ServiceProvider {

	/**
	 * Register any application services.
	 *
	 * @return void
	 */
	public function register() {
		//
	}

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot() {
		View::addLocation(resource_path('admin/views'));

		$this->app->singleton('layout', function () { return new Layout(); });
	}

}
