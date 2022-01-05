<?php

namespace App\Services\Yandex\Devices;

class ProjectorScreen extends AbstractDevice {

	protected static $type = 'devices.types.openable';
	protected static $capabilityType = 'devices.capabilities.on_off';

	public function addCapabilitiesData() {
		$this->capabilities[] = [
			'type' => self::$capabilityType,
			'retrievable' => false
		];
	}

	public function addCapabilitiesState() {

	}

	public function command($capabilities) {
		//[{\"type\":\"devices.capabilities.on_off\",\"state\":{\"instance\":\"on\",\"value\":false}}]
		foreach ($capabilities as $capability) {
			//if ($capability->type !== self::$capabilityType)
			if ($capability->state->value)
				$this->device->command('open');
			else
				$this->device->command('close');

			$this->capabilities[] = [
				'type' => self::$capabilityType,
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
