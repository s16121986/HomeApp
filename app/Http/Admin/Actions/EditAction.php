<?php

namespace App\Http\Admin\Actions;

use App\Custom\Admin\Form\Form;
use App\Custom\Admin\Form\Meta;

class EditAction extends AbstractAction {

	protected $view = 'default.form';

	protected $id;

	protected $model;

	public function run($id, $model = null) {
		$model = $model ?? $this->controller::model();

		if ($id === 'new')
			$this->model = new $model();
		else {
			$this->model = $model::find($id);
			if (!$this->model)
				abort(404);
		}

		$this->id = $id;

		$this->set('id', $id);
		$this->set('new', $this->id === 'new');
	}

	public function form($options = null): Form {
		return $this->data['form'] ?? $this->data['form'] = new Form($options ?? 'data');
	}

	public function model() {
		return $this->model;
	}

	public function title($newTitle, $editTitle = null): static {
		return parent::title($this->id === 'new' ? $newTitle : ($editTitle ?? (string)$this->model));
	}

	public function submit() {

		if ($this->form->submit()) {
			$data = $this->form->getData();
			foreach ($data as $k => $v) {
				if ($v === '')
					$data[$k] = null;
			}

			$this->model->fill($data);
			$this->model->save($data);

			//$this->form->saveUploads($this->model);

			$routeIndex = self::routeName('index');

			return $this->controller->redirect(route($routeIndex));
		} else if (!$this->new)
			$this->form->setModel($this->model);

		return $this;
	}

	public function breadcrumbs() {
		$breadcrumbs = parent::breadcrumbs();

		if ($this->new)
			$breadcrumbs->add($this->title);
		else if (method_exists($this->controller, 'view')) {
			$route = self::routeName('view');
			$breadcrumbs->add($this->title, $route, ['id' => $this->id]);
			$breadcrumbs->add('Редактирование');
		} else {
			$breadcrumbs->add($this->title);
		}

		return $breadcrumbs;
	}

	public function menus() {
		$this->controller->layout->menu('h1', true)
			->separator()
			->delete();
	}

}
