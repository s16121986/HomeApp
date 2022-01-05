<?php

namespace App\Services\IO\Modbus;

use App\Services\IO\SerialTool\Response as AbstractResponse;

class Response extends AbstractResponse {

	protected function _init() {
		/*Data to write: 0x0
Opening /dev/RS485 at 9600 bauds (N, 8, 2)
[6B][06][00][01][00][00][D1][00]
Waiting for a confirmation...
<6B><06><00><01><00><00><D1><00>
SUCCESS: written 1 elements!*/
		if (!$this->response)
			return;

		if (0 === strpos($this->response, 'SUCCESS')) {
			$this->data = [];
			return;
		} else if (!preg_match_all('/<([0-9abcdef]{2})>/i', $this->response, $m))
			return;

		$this->data = [];
		foreach ($m[1] as $hex) {
			$this->data[] = hexdec($hex);
		}
		//var_dump($response);//exit;
	}

}
