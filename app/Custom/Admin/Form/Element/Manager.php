<?php

namespace App\Custom\Admin\Form\Element;

use App\Repositories\Administrator\ManagerRepository;
use Gsdk\Form\Element\Select;

class Manager extends Select {

	protected function init() {
		$this
			->label('Менеджер')
			->items(ManagerRepository::getManagers());
	}

}
