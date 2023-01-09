<?php

namespace App\Http\Site\Providers;

use App\Broadcaster\Notifier\Notifier;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;
use Illuminate\Broadcasting\BroadcastManager;

class BroadcastServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap any application services.
	 *
	 * @return void
	 */
	public function boot(BroadcastManager $broadcastManager) {
		$broadcastManager->extend('notifier', function ($app, array $config) {
			return new Notifier($config);
		});
		/*Broadcast::routes();

		require base_path('routes/channels.php');*/
	}

}
