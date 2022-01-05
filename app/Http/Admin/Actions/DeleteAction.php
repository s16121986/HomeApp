<?php

namespace App\Http\Admin\Actions;


class DeleteAction extends AbstractAction {

	protected $id;

	protected $model;

	public function run($id, $model = null) {
		$model = $model ?? $this->controller::model();
		$this->model = call_user_func([$model, 'find'], $id);
		if (!$this->model)
			abort(404);

		$this->id = $id;
	}

	public function model() {
		return $this->model;
	}

	public function delete() {
		$routeIndex = self::routeName('index');

		$this->model->delete();

		return $this->controller->redirect(route($routeIndex));
	}

	public function layout($view = null, array $data = null) {
		return $this->delete();
	}

}
