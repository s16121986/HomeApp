<?php

namespace App\Home\Commands;

use App\Events\Home\StateChanged;
use App\Home\DeviceFactory;
use App\Home\Settings\LightsState;
use App\Models\Home\Device;

class HomeCommands extends AbstractCommands {

	public function scenario($data) {
		//return ScenarioManager::setCurrent($data);
	}

	public function lightOn() {
		$lights = LightsState::value();
		//var_dump($lights);

		//DeviceObserver::setRoomEventsEnabled(false);

		foreach ($lights as $id) {
			DeviceFactory::find($id)->on();
		}

		//DeviceObserver::setRoomEventsEnabled(true);

		StateChanged::dispatch();
	}

	public function lightOff() {
		$lights = Device::query()
			->whereIsLight()
			->whereActive()
			->pluck('id')
			->toArray();
		//var_dump($lights);

		LightsState::change($lights);

		//DeviceObserver::setRoomEventsEnabled(false);

		foreach ($lights as $id) {
			DeviceFactory::find($id)->off();
		}

		//DeviceObserver::setRoomEventsEnabled(true);

		StateChanged::dispatch();

		//$this->home->updateLights();

	}

	public function lightToggle() {
		if (home()->hasActiveLights())
			$this->lightOff();
		else
			$this->lightOn();
	}

	public function changeSettings($data) {
		home()->settings()->setValue($data->name, $data->value);
	}

}
