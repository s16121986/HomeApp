<?php

use App\Http\Api\Controllers\YandexController;
use App\Http\Api\Middleware\YandexAuth;
use App\Http\Api\Middleware\YandexVersion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('oauth2')
	->group(function () {
		$oauthController = 'App\Http\Api\Controllers\OauthController';

		Route::get('/authorize', [$oauthController, 'authorize']);
		Route::post('/token', [$oauthController, 'token']);
	});

Route::prefix('yandex/{version}')
	->where(['version' => 'v\d\.\d'])
	->middleware([YandexAuth::class])
	->group(function () {
		$controller = YandexController::class;
		Route::get('/', $controller . '@ping');
		Route::get('/user/unlink', $controller . '@unlink');
		Route::get('/user/devices', $controller . '@devices');
		Route::post('/user/devices/query', $controller . '@query');
		Route::post('/user/devices/action', $controller . '@state');
		//	Route::get('/d', 'ping']);
	});

Route::get('/test', YandexController::class . '@test');
