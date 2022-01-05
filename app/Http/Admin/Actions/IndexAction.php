<?php

namespace App\Http\Admin\Actions;

use App\Helpers\Admin\Grid\Grid;

class IndexAction extends AbstractAction {

	protected $view = 'default.grid';

	public function grid(array $options = null): Grid {
		return $this->data['grid'] ?? $this->data['grid'] = new Grid($options ?? []);
	}

	public function run() { }

	public function repository($repository = null) {
		$this->grid()->repository($repository);
		return $this->query();
	}

	public function query($query = null) {
		return $this->grid()->query($query);
	}

	public function layout($view = null, array $data = null) {
		$grid = $this->grid();
		if (empty($grid->getData()->getData()))
			$grid->repository($this->controller::repository);

		return parent::layout($view, $data);

	}

}
