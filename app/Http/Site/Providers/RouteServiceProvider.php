<?php

namespace App\Http\Site\Providers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class RouteServiceProvider extends ServiceProvider {

	public function boot() {
		Route::pattern('id', '[0-9]+');

		$this->routes(function () {
			Route::middleware('web')
				->namespace($this->namespace)
				->group(base_path('routes/site.php'));
		});
	}

}
