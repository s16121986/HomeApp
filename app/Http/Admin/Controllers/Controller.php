<?php

namespace App\Http\Admin\Controllers;

use App\Http\Admin\Actions;
use Illuminate\Support\Facades\View;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {

	use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

	public function callAction($method, $parameters) {
		$callMethod = $method;// . 'Action';
		if (!method_exists($this, $callMethod))
			return abort(404);

		$response = call_user_func_array([$this, $callMethod], array_values($parameters));

		if ($response instanceof Actions\AbstractAction)
			return $response->layout();
		else
			return $response;
	}

	public function action($name = null, ...$args) {
		$action = match ($name) {
			'index' => new Actions\IndexAction($this),
			'edit' => new Actions\EditAction($this),
			'delete' => new Actions\DeleteAction($this),
			'search' => new Actions\SearchAction($this),
		};

		call_user_func_array([$action, 'run'], $args);

		return $action;
	}

	public function index() {
		return redirect(route('device.index'));
	}

	public function redirect($url) {
		if (request()->expectsJson())
			return self::jsonRedirect($url);
		else
			return redirect($url);
	}

	protected static function jsonResponse(array $data) {
		return response()->json($data);
	}

	protected static function jsonRedirect($url) {
		return self::jsonResponse(['action' => 'redirect', 'url' => $url]);
	}

	protected static function jsonReload() {
		return self::jsonResponse(['action' => 'reload']);
	}

}
