<?php

namespace App\Http\Api\Middleware;

use Illuminate\Http\Request;
use Closure;

class DebugMode {

	public function handle(Request $request, Closure $next) {
		$debugMode = env('API_DEBUG') || $request->header('X-Debug-Log');
		if (!$debugMode)
			return $next($request);

		$headers = [];
		foreach ($request->header() as $k => $a) {
			$headers[$k] = $a[0];
		}

		self::write($request->method()
			. ' ' . $request->url()
			. ' ' . var_export($headers, true)
			. ' ' . var_export($request->input(), true));

		return $next($request);
	}

	public static function write($s) {
		if (is_array($s))
			$s = var_export($s, true);

		$filename = storage_path('logs/api.log');
		$h = fopen($filename, 'a');
		fwrite($h, '[' . now()->format('Y-m-d H:i:s') . '] ' . $s . "\n");
		fclose($h);
	}

}
