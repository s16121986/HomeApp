<?php

namespace App\Http\Admin\Actions;

class SearchAction extends AbstractAction {

	public function run() { }

	public function layout($view = null, array $data = null) {
		$repository = $this->controller::repository;

		return response()->json([
			'items' => $repository::select(request()->input())
		]);

	}

}
