<?php

namespace Module\Webhook\Services\Response;

class Common extends AbstractResponse{

	const VERSION = '1.0';

	private $data = [
		'end_session' => true
	];

	public function setText($text) {
		$this->data['text'] = $text;
		return $this;
	}

	public function setTTS($tts) {
		$this->data['tts'] = $tts;
		return $this;
	}

	public function setEnd($flag) {
		$this->data['end_session '] = (bool)$flag;
		return $this;
	}

	public function __toString() {
		echo json_encode([
			'response' => $this->data,
			'version' => self::VERSION
		]);
	}

}