<?php

namespace App\Custom\Admin\Form\Element;

use App\Repositories\Reference\CountryRepository;
use Gsdk\Form\Element\Select;

class Country extends Select {

	protected function init() {
		$this
			->label('Страна')
			->items(CountryRepository::items());
	}

}
