<?php

namespace App\Services\IO\Xiaomi;

use App\Services\IO\SerialTool\Response as AbstractResponse;

class Response extends AbstractResponse {

	protected function init() {
		//var_dump($response);
		if (!$this->response)
			return;

		//Stop cleaning: ['ok']
		if (false !== strpos($this->response, '[\'ok\']'))
			$this->data = [];
	}

}
