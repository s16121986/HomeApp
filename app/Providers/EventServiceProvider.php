<?php

namespace App\Providers;

use App\Listeners\ArduinoEventSubscriber;
use App\Listeners\HomeEventSubscriber;
use App\Models\Home\Device;
use App\Models\Home\Room;
use App\Observers\Home\DeviceObserver;
use App\Observers\Home\RoomObserver;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider {

	/**
	 * The event listener mappings for the application.
	 *
	 * @var array
	 */
	protected $listen = [
	];

	protected $subscribe = [
		ArduinoEventSubscriber::class,
		HomeEventSubscriber::class,
	];

	/**
	 * Register any events for your application.
	 *
	 * @return void
	 */
	public function boot() {
		Device::observe(DeviceObserver::class);
		Room::observe(RoomObserver::class);
	}

}
