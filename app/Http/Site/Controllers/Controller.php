<?php

namespace App\Http\Site\Controllers;

use App\Entities\Scenario\Condition\TimeEqual;
use App\Events\Device\StateChanged;
use App\Events\Home\Timer;
use App\Events\Sensors\ButtonPressed;
use App\Events\Sensors\ButtonReleased;
use App\Events\Sensors\MotionDetected;
use App\Models\Home\Device;
use App\Models\Home\Room;
use App\Services\Http\MetaService;
use App\Services\IO\Modbus\Util\CRC16;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\View;

class Controller extends BaseController {

	use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

	public function __construct() {
		View::addLocation(resource_path('home/views'));
	}

	public function index() {
		return view('dashboard', [
			'meta' => MetaService::instance()->configure([
				'title' => 'HomeApp',
				'style' => 'dashboard'
			])
		]);
	}

	public function test() {
		//Timer::dispatch();
		//\App\Events\Home\Nightfall::dispatch();
		//$x = new \App\Home\Modules\WirenBoard\ACDimmer(12);
		//exit;

		$bytes = [];
		$bytes[] = 22;
		$bytes[] = 5;
		self::splitBytes($bytes, 4);
		self::splitBytes($bytes, 1 ? 0xFF00 : 0);
		$crc = CRC16::calculate($bytes);
		var_dump($crc);
		self::splitBytes($bytes, $crc);

		/*$buffer = [];
		$buffer[] = self::packByte(22);
		$buffer[] = self::packByte(5);
		self::splitBytes($buffer, 4);
		self::splitBytes($buffer, 1 ? 0xFF00 : 0);
		var_dump(implode('', $buffer));
		self::splitBytes($buffer, CRC16::calculate(implode('', $buffer)));*/
		foreach ($bytes as $byte) {
			var_dump(self::packByte($byte));
		}

		//$device = home()->device(28);
		//$device->moduleFlowersLightOn();
		exit;/**/

		//$room = Room::find(5);
		/*$room = home()->room(4);
		$room->lightOn();
		dd($room->lights);*/
		/*$room->updateLights();*/
		//$device = Device::find(33);
		//$device->fill(['state' => 1]);
		//$device = Device::find(11);
		//ButtonReleased::dispatch($device);

		/*$device = Device::find(3);
		$device->state = 0;
		$device->save();*/

		/*$device = Device::find(11);
		//ButtonReleased::dispatch($device);
		MotionDetected::dispatch($device);
		//\App\Events\Room\StateChanged::dispatch(Room::find(4));*/
	}

	protected static function packByte($data): string {
		return str_pad(dechex($data), 2, '0', STR_PAD_LEFT);
		//return '0x' . dechex($data);
	}

	protected static function packBytes($data): string {
		$high = $data>>8;
		$low = $data & 0xff;
		return self::packByte($high) . ' ' . self::packByte($low);
		return str_pad(dechex($data), 2, '0', STR_PAD_LEFT);
		//return '0x' . dechex($data);
	}

	protected static function splitBytes(&$bytes, $data) {
		$bytes[] = $data>>8;
		$bytes[] = $data & 0xff;
	}

}
