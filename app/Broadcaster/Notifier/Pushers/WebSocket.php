<?php

namespace App\Broadcaster\Notifier\Pushers;

class WebSocket {

	private static $connection;

	private static function connect($url) {
		self::$connection = stream_socket_client($url);
		if (self::$connection)
			register_shutdown_function(function () { WebSocket::disconnect(); });
	}

	private static function disconnect() {
		if (!self::$connection)
			return;
		fclose(self::$connection);
		self::$connection = null;
	}

	private static function messageFactory($channel, $event, array $payload): bool|string {
		return json_encode([
			'channel' => $channel,
			'payload' => json_encode([
				'type' => $event,
				'value' => $payload
			])
		]);
	}

	public function __construct($config) {
		self::connect($config['url']);
	}

	public function broadcust(array $channels, $event, array $payload) {
		if (!self::$connection)
			return;

		foreach ($channels as $channel) {
			fwrite(self::$connection, self::messageFactory((string)$channel, $event, $payload) . "\n");
		}
	}

}
