<?php

namespace App\Http\Site\Controllers;

use App\Events\Device\StateChanged;
use App\Events\Sensors\ButtonPressed;
use App\Events\Sensors\ButtonReleased;
use App\Models\Home\Device;
use App\Models\Home\Room;
use App\Services\Http\MetaService;
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
		//$x = new \App\Home\Modules\WirenBoard\ACDimmer(12);
		//exit;
		/*$device = home()->device(38);
		$device->toggle();
		exit;*/

		/*$room = Room::find(5);
		dd($room->lights);*/
		/*$room->updateLights();*/
		//$device = Device::find(33);
		//$device->fill(['state' => 1]);
		//$device = Device::find(11);
		//ButtonReleased::dispatch($device);
		$device = Device::find(32);
		ButtonPressed::dispatch($device);
		//StateChanged::dispatch($device);
	}

}
