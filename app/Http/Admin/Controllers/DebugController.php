<?php

namespace App\Http\Admin\Controllers;

use Illuminate\Http\Request;

class DebugController extends Controller {

	public function modbus(Request $request) {
		$cmd = $request->post('command');
		return [
			'response' => shell_exec($cmd)
		];
	}

}
