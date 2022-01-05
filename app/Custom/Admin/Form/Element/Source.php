<?php

namespace App\Custom\Admin\Form\Element;

use App\Enums\AppSource;
use Gsdk\Form\Element\Enum;

class Source extends Enum {

	protected function init() {
		$this
			->label('Источник')
			->enum(AppSource::class);
	}

}
