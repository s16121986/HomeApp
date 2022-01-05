<?php

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
		$yandexController = 'App\Http\Api\Controllers\YandexController';

		Route::get('/', [$yandexController, 'ping']);
		Route::get('/user/unlink', [$yandexController, 'unlink']);
		Route::get('/user/devices', [$yandexController, 'devices']);
		Route::post('/user/devices/query', [$yandexController, 'query']);
		Route::post('/user/devices/action', [$yandexController, 'state']);
		//	Route::get('/d', [$yandexController, 'ping']);
	});
