<?php

namespace App\Custom\Admin\Form;

use App\Custom\Admin\Form\Element\File;
use Form as BaseForm;

class Form extends BaseForm {

	const emptyItem = '';

	public static function register() {
		self::registerNamespace(__NAMESPACE__ . '\\Element');
	}

	protected function init() {
		$this->setId('form_data');
	}

	protected function addDefaultSelect($name, $type, array $options) {
		return $this->addElement($name, $type, array_merge([
			'emptyItem' => self::emptyItem
		], $options));
	}

	public function setModel($model): static {
		//$this->setData($model->toArray());
		foreach ($this->elements as $element) {
			//var_dump($element->name, $model->{$element->name});
			$element->setValue($model->{$element->name});
		}

		/*$translation = $model->translation();

		foreach ($this->elements as $element) {
			if ($element->locale)
			$values = $translation->getAttributeValues($element->name);
			$element->setValue($values);
		}*/

		return $this;
	}

	public function saveUploads($model) {
		foreach ($this->elements as $element) {
			if ($element instanceof File)
				$element->saveUpload($model);
		}
	}

}
