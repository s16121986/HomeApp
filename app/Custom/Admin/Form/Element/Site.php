<?php

namespace App\Custom\Admin\Form\Element;

use App\Repositories\System\SiteRepository;
use Gsdk\Form\Element\Select;

class Site extends Select {

	protected function init() {
		$this
			->label('Раздел')
			->items(SiteRepository::items());
	}

}
