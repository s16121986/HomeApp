<?php

namespace App\Http\Site\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\View;

class ViewServiceProvider extends ServiceProvider {

	public function register() {
		View::addLocation(resource_path('home/views'));
	}

	public function boot() {

	}

}
