<?php

namespace App\Broadcaster\Notifier;

use App\Models\Home\Device;
use App\Repositories\HomeRepository;

class Broadcast {

	public static function boot() {
		self::route('ping', 'pong');
	}

	private static function callMethod(PusherEvent $event) {
		if (isset(self::$routes[$event->method]))
			return call_user_func(self::$routes[$event->method], $event);
		else
			return null;
	}

	public static function handleEvent($event) {
		switch ($event->method) {
			case 'ping':
				return 'pong';
			case 'home.sendCommand':

				break;
			case 'home.getInfo':
				return [
					'home' => HomeRepository::home()->toArray(),
					'rooms' => HomeRepository::rooms(),
					'devices' => Device::whereEnabled()->get()->toArray()
				];
		}
	}

	public static function onMessage($connection, $event) {
		$result = self::handleEvent($event);
		if (null === $result)
			return;

		$connection->send(json_encode([
			'id' => $event->id,
			'result' => $result
		]));
	}

}
