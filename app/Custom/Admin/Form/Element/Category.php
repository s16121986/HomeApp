<?php

namespace App\Custom\Admin\Form\Element;

use App\Repositories\Reference\CategoryRepository;
use App\Repositories\System\SiteRepository;
use Gsdk\Form\Element\Select;

class Category extends Select {

	protected function init() {
		$this
			//->name('category_id')
			->label('Категория')
			->groups(SiteRepository::items())
			->groupIndex('site_id')
			->items(CategoryRepository::items());
	}

}
