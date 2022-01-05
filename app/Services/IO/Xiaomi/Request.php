<?php

namespace App\Services\IO\Xiaomi;

class Request {

	const SCRIPT = '/usr/local/bin/mirobo';

	public static function send($ipAddress, $token, $command, $data = null) {
		$bash = '/usr/local/bin/mirobo --ip ' . $ipAddress . ' --token ' . $token;

		$bash .= ' ' . $command;

		if (null !== $data)
			$bash .= ' ' . $data;

		return new Response(shell_exec($bash), ['command' => $bash]);
	}

}
