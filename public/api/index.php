<?php
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));
define('ROOT_PATH', realpath(__DIR__ . '/../../'));

const APP_SCRIPT = 'web_api';

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
|
| If the application is in maintenance / demo mode via the "down" command
| we will load this file so that any pre-rendered content can be shown
| instead of starting the framework, which could cause an exception.
|
*/

if (file_exists(ROOT_PATH . '/storage/framework/maintenance.php')) {
	require ROOT_PATH . '/storage/framework/maintenance.php';
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| this application. We just need to utilize it! We'll simply require it
| into the script here so we don't need to manually load our classes.
|
*/

require ROOT_PATH . '/vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application, we can handle the incoming request using
| the application's HTTP kernel. Then, we will send the response back
| to this client's browser, allowing them to enjoy our application.
|
*/

$app = require_once ROOT_PATH . '/bootstrap/app.php';

$app->instance(
	App\Contracts\DomainServiceProvider::class,
	App\Http\Api\Providers\BootServiceProvider::class
);

$kernel = $app->make(Kernel::class);

$request = Request::capture();

$response = $kernel->handle(
	$request
);

/*use Illuminate\Support\Facades\DB;

DB::table('api_log')
	->insert([
		'method' => $request->method(),
		'uri' => $request->path(),
		'request' => json_encode([
			'headers' => apache_request_headers(),//$request->headers(),
			'data' => $request->input(),
			'input' => json_decode(file_get_contents('php://input'))
		], true)
	]);*/
$response->send();

$kernel->terminate($request, $response);
