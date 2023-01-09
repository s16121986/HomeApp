<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

const ROUTE_NAMESPACE = 'App\Http\Admin\Controllers\\';

Route::get('/', [ROUTE_NAMESPACE . 'Controller', 'index']);

$crud = function ($name, $controller) {
	$path = '/' . $name;

	if (method_exists($controller, 'index'))
		Route::get($path, [$controller, 'index'])->name($name . '.index');

	if (method_exists($controller, 'view'))
		Route::get($path . '/{id}', [$controller, 'view'])->name($name . '.view');

	Route::match(['get', 'post'], $path . '/create', [$controller, 'create'])->name($name . '.create');

	Route::match(['get', 'post'], $path . '/{id}/edit', [$controller, 'edit'])->name($name . '.edit');

	if (method_exists($controller, 'update'))
		Route::get($path . '/{id}/update', [$controller, 'update'])->name($name . '.update');

	Route::get($path . '/{id}/delete', [$controller, 'delete'])->name($name . '.delete');
};
$flags = function ($controller, $path, array $actions) {
	foreach ($actions as $action) {
		Route::get($path . '/' . $action, [$controller, $action]);
	}
};

$crud('module', ROUTE_NAMESPACE . 'ModuleController');

$crud('device', ROUTE_NAMESPACE . 'DeviceController');

$actionController = ROUTE_NAMESPACE . 'ActionController';
$crud('action', $actionController);
Route::match(['get', 'post'], '/action/{id}/event', [$actionController, 'event']);
Route::match(['get', 'post'], '/action/{id}/condition', [$actionController, 'condition']);
Route::match(['get', 'post'], '/action/{id}/command', [$actionController, 'command']);

$crud('scenario', ROUTE_NAMESPACE . 'ScenarioController');

Route::get('/settings/debug', [\App\Http\Admin\Controllers\SettingsController::class, 'debug']);
Route::post('/debug/modbus', [\App\Http\Admin\Controllers\DebugController::class, 'modbus']);

//$crud('command', ROUTE_NAMESPACE . 'ActionController');
