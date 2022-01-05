<?php

namespace App\Services\IO\SerialTool;

class Response {

	protected $debugData;
	protected $response;
	protected $data = false;

	public function __construct($response, array $debugData = []) {
		$this->response = $response;
		$this->debugData = $debugData;

		/*if ($response && strpos($response, '<< ') === 0) {
			$this->data = [];
			$s = substr($response, 3);
			foreach (explode(' ', $s) as $c) {
				$this->data[] = hexdec($c);
			}
		}*/

		$this->init();
	}

	protected function init() {
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
	}

	public function isValid(): bool {
		return $this->data !== false;
	}

	public function getResponse() {
		return $this->response;
	}

	public function get($index) {
		return $this->data[$index] ?? null;
	}

	public function getData($asString = false) {
		if (!$asString || !$this->data)
			return $this->data;

		$a = [];
		foreach ($this->data as $d) {
			$a[] = dechex($d);
		}

		return join(' ', $a);
	}

	public function hasData(): bool {
		return !empty($this->data);
	}

	public function getSize(): int {
		return $this->data ? count($this->data) : 0;
	}

	public function getDebug(): array {
		return array_merge([
			'response' => $this->response,
			'debug_data' => $this->getData(true)
		], $this->debugData);
	}

}
