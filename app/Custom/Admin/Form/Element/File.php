<?php

namespace App\Custom\Admin\Form\Element;

use App\Files\AbstractFile;
use App\Services\Filesystem\FileService;
use Gsdk\Form\Element\Xhtml;

class File extends Xhtml {

	protected $attributes = ['multiple'];

	public function isFileUpload() {
		return false;//(bool)$this->uploadable;
	}

	protected function saveFile($value, $model, $file = null) {
		if (empty($value) || !isset($value['tmp_name']))
			return;

		$fileClass = $this->file;

		if (!$file)
			$file = call_user_func([$fileClass, 'createFromEntity'], $model);

		if ($this->isFileUpload()) {
			FileService::saveFileFromUpload($file, request()->file('data.' . $this->name));
		} else
			FileService::saveFileFromTemp($file, $value['tmp_name'], [
				'name' => $value['name']
			]);
	}

	public function saveUpload($model) {
		$fileClass = $this->file;
		$value = $this->getValue();
		if ($this->multiple) {
			if (empty($value))
				return;

			foreach ($value as $item) {
				$this->saveFile($item, $model);
			}
		} else {
			$file = call_user_func([$fileClass, 'findByEntity'], $model);
			$this->saveFile($value, $model, $file);
		}
	}

	protected function getFileInput($value): string {
		if (empty($value))
			return '';

		if (is_numeric($value)) {
			$file = AbstractFile::findById($value);
			if (!$file)
				return '';

			$value = $file->toArray();
		} else if (is_string($value)) {
			$file = AbstractFile::findByGuid($value);
			if (!$file)
				return '';

			$value = $file->toArray();
		} else if ($value instanceof AbstractFile)
			$value = $value->toArray();

		return '<input type="hidden"'
			//. ' name="' . $inputName . '[data]"'
			. ' value="' . self::escape(json_encode($value)) . '" />';
	}

	public function getHtml(): string {
		$html = '';
		//$inputName = $this->getInputName();
		$value = $this->getValue();

		if ($this->multiple) {
			if ($value && is_iterable($value)) {
				foreach ($value as $v) {
					$html .= $this->getFileInput($v);
				}
			}
		} else
			$html .= $this->getFileInput($value);

		$html .= '<input type="file"'
			. $this->attributes
			. ' />';

		return $html;
	}

}
