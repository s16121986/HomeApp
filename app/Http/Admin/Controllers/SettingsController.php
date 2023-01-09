<?php

namespace App\Http\Admin\Controllers;

use App\Models\Home\Device;
use Illuminate\Http\Request;

class SettingsController extends Controller {

	public function debug() {

		$modules = Device::whereCanModbus()
			->get();

		return app('layout')
			->title('Debug')
			->addMetaVariable('modules', $modules->map(function ($m) {
				return [
					'id' => $m->id,
					'name' => $m->room_name . ' / ' . $m->name,
					'address' => $m->address
				];
			}))
			->ss('settings/debug')
			->view('settings/debug');
	}

}
