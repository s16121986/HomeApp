<?php

namespace App\Http\Admin\Controllers;

use App\Http\Admin\Actions\AbstractAction;
use App\Http\Admin\Actions\CustomAction;
use App\Http\Admin\Actions\DeleteAction;
use App\Http\Admin\Actions\EditAction;
use App\Http\Admin\Actions\IndexAction;
use App\Http\Admin\Actions\SearchAction;
use App\Http\Admin\Actions\ViewAction;
use App\Services\Http\MetaService;
use Illuminate\Support\Facades\View;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {

	use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

	public function __construct() {
		/*MetaService::setDefaults([
			'title' => 'Панель администратора'
		]);*/

		View::addLocation(resource_path('admin/views'));
	}

	public function __get($name) {
		switch ($name) {
			case 'meta':
				return MetaService::instance();
		}

		return null;
	}

	public function callAction($method, $parameters) {
		$callMethod = $method;// . 'Action';
		if (!method_exists($this, $callMethod))
			return abort(404);

		$response = call_user_func_array([$this, $callMethod], array_values($parameters));

		if ($response instanceof AbstractAction)
			return $response->layout();
		else
			return $response;
	}

	public function action($name = null, ...$args) {
		$action = match ($name) {
			'index' => new IndexAction($this),
			'view' => new ViewAction($this),
			'edit' => new EditAction($this),
			'delete' => new DeleteAction($this),
			'search' => new SearchAction($this),
			'auth' => new AuthAction($this),
			default => new CustomAction($this),
		};

		call_user_func_array([$action, 'run'], $args);

		return $action;
	}

	public function index() {
		dd('4');
	}

	public function layout($view, array $data = []) {
		return view('layouts.default', [
			'meta' => $this->meta->configure(array_merge([
				'style' => 'main'
			], $data)),
			'content' => view($view, $data)
		]);
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
