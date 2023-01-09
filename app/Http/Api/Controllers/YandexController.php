<?php

namespace App\Http\Api\Controllers;

use App\Models\Home\Device;
use App\Services\Yandex\Devices\AbstractDevice;
use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Exception;

class YandexController extends Controller {

	//v1.0\/user\/devices\/

	public function ping() {
		dd(233);
		return [];
	}

	public function unlink(Request $request) {
		return [
			'request_id' => $request->get('requestId')
		];
	}

	public function devices(Request $request) {
		$homeDevices = Device::whereEnabled()
			->where('ya_enabled', true)
			->get();

		$yaDevices = [];
		foreach ($homeDevices as $homeDevice) {
			$device = AbstractDevice::factory($homeDevice);
			$device->addCapabilitiesData();
			$yaDevices[] = $device->toArray();
		}

		$token = $request->get('token');

		return [
			'request_id' => $request->get('requestId'),
			'payload' => [
				'user_id' => $request->get('userId'),
				'devices' => $yaDevices
			]
		];
	}

	public function query(Request $request) {
		$data = self::getRequestData();

		$devices = [];
		foreach ($data->devices as $r) {
			$device = self::getDevice($r->id);
			if (!$device)
				continue;
			$devices[] = $device;
		}

		return [
			'request_id' => $request->get('requestId'),
			'payload' => [
				'user_id' => $request->get('userId'),
				'devices' => array_map(function ($device) {
					$device->addCapabilitiesState();
					return $device->toArray();
				}, $devices)
			]
		];
	}

	public function state(Request $request) {
		//{\"payload\":{\"devices\":[{\"id\":\"6\",\"capabilities\":[]}]}}
		$data = self::getRequestData();
		//var_dump($data);exit;

		$devices = [];
		foreach ($data->payload->devices as $r) {
			$device = self::getDevice($r->id);
			if (!$device)
				continue;
			$device->command($r->capabilities);
			$devices[] = $device->toArray();
		}

		return [
			'request_id' => $request->get('requestId'),
			'payload' => [
				'user_id' => $request->get('userId'),
				'devices' => $devices
			]
		];
	}

	public function test() {
		return [];
		$data = '{"payload":{"devices":[{"id":"47","capabilities":[{"type":"devices.capabilities.on_off","state":{"instance":"on","value":true}}]}]}}';
		$data = json_decode($data);

		$devices = [];
		foreach ($data->payload->devices as $r) {
			$device = self::getDevice($r->id);
			if (!$device)
				continue;
			$device->command($r->capabilities);
		}
		return [];
	}

	private static function getDevice($id) {
		$homeDevice = Device::find($id);
		if (!$homeDevice->enabled || !$homeDevice->ya_enabled)
			return null;

		return AbstractDevice::factory($homeDevice);
	}

	private static function getRequestData() {
		$input = file_get_contents('php://input');
		//$input = '{"payload":{"devices":[{"id":"18","capabilities":[{"type":"devices.capabilities.on_off","state":{"instance":"on","value":true}}]}]}}';
		//$input = "{\"devices\":[{\"id\":\"6\"}]}";

		/*Db::insert('api_log', [
			'uri' => $_SERVER['REQUEST_URI'],
			'request' => $input
		]);*/
		return json_decode($input);
	}

}
