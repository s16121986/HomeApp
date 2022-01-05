<?php

namespace App\Custom\Admin\Form\Element;

use Gsdk\Form\Element\Select;

class Language extends Select {

	protected function init() {
		$array = [];
		foreach (app('languages') as $l) {
			$array[$l->code] = $l->name;
		}

		$this
			->name($this->name ?? 'language')
			->label('Язык')
			->items($array);
	}

}
