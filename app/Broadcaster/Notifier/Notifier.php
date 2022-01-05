<?php

namespace App\Broadcaster\Notifier;

use App\Broadcaster\Notifier\Pushers\WebSocket;
use Illuminate\Support\Facades\Auth;
use Illuminate\Broadcasting\Broadcasters\Broadcaster as BaseBroadcaster;

class Notifier extends BaseBroadcaster {

	private $pushers = [];

	public function __construct($config) {
		$this->pushers[] = new WebSocket($config['websocket']);
	}

	/**
	 * {@inheritdoc}
	 */
	public function auth($request) {
		//
	}

	/**
	 * {@inheritdoc}
	 */
	public function validAuthenticationResponse($request, $result) {
		//
	}

	public function broadcast(array $channels, $event, array $payload = []) {
		foreach ($this->pushers as $pusher) {
			$pusher->broadcust($channels, $event, $payload);
		}
		//var_dump(func_get_args());
	}

}
