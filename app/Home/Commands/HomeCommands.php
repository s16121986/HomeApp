<?php

namespace App\Home\Commands;

use App\Events\Home\StateChanged;
use App\Home\DeviceFactory;
use App\Models\Home\Device;
use App\Models\Home\Settings;
use App\Observers\Home\DeviceObserver;

class HomeCommands extends AbstractCommands {

	public function scenario($data) {
		//return ScenarioManager::setCurrent($data);
	}

	public function lightOn() {
		$lights = Settings::where('name', 'lights')->value('value');
		$lights = $lights ? json_decode($lights) : [];
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

		Settings::where('name', 'lights')
			->update(['value' => json_encode($lights)]);

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

}
