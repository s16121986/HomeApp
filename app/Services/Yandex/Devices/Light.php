<?php

namespace App\Services\Yandex\Devices;

class Light extends AbstractDevice {

	protected static $type = 'devices.types.light';
	protected static $capabilityType = 'devices.capabilities.on_off';

	public function addCapabilitiesData() {
		$this->capabilities[] = [
			'type' => static::$capabilityType,
			'retrievable' => true,
			'reportable' => false,
			'parameters' => [
				'split' => false
			]
		];
	}

	public function addCapabilitiesState() {
		$this->capabilities[] = [
			'type' => static::$capabilityType,
			'state' => [
				'instance' => 'on',
				'value' => (bool)$this->device->state
			]
		];
	}

	public function command($capabilities) {
		//[{\"type\":\"devices.capabilities.on_off\",\"state\":{\"instance\":\"on\",\"value\":false}}]
		foreach ($capabilities as $capability) {
			//if ($capability->type !== self::$capabilityType)
			if ($capability->state->value)
				$this->device->command('on');
			else
				$this->device->command('off');

			$this->capabilities[] = [
				'type' => static::$capabilityType,
				'state' => [
					'instance' => 'on',
					'action_result' => [
						'status' => 'DONE'
						//"status": "ERROR",
						//"error_code": "INVALID_ACTION",
						//"error_message": "the human readable error message"
					]
				]
			];

			break;
		}
	}

}
