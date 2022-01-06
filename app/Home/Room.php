<?php

namespace App\Home;

//use App\Models\Home\Device;
use App\Events\Room\StateChanged;
use App\Models\Home\Room as RoomModel;
use App\Observers\Home\DeviceObserver;

class Room {

	protected RoomModel $model;

	public function __construct(RoomModel $model) {
		$this->model = $model;
	}

	public function __get(string $name) {
		return $this->model->$name;
	}

	public function command($command, $data) {
		if (!method_exists($this, $command))
			throw new Exception('Room command [' . $command . '] not exists');

		if (null === $data)
			return $this->$command();
		else
			return $this->$command($data);
	}

	public function lightOn() {
		//DeviceObserver::setRoomEventsEnabled(false);
		$lights = $this->model->lights;
		if (empty($lights))
			$lights = $this->model->devices()
				->whereIsLight()
				->whereDefault()
				->pluck('id');

		DeviceObserver::setRoomStateEvents(false);

		foreach ($lights as $id) {
			DeviceFactory::find($id)->on();
		}

		DeviceObserver::setRoomStateEvents(true);

		StateChanged::dispatch(RoomModel::find($this->model->id));
	}

	public function lightOff() {
		//DeviceObserver::setRoomEventsEnabled(false);
		//$dispatcher = RoomModel::getEventDispatcher();
		//RoomModel::unsetEventDispatcher();
		$ids = $this->model->devices()
			->whereIsLight()
			->whereActive()
			->pluck('id');

		DeviceObserver::setRoomStateEvents(false);

		foreach ($ids as $id) {
			DeviceFactory::find($id)->off();
		}

		DeviceObserver::setRoomStateEvents(true);

		//RoomModel::setEventDispatcher($dispatcher);
		//DeviceObserver::setRoomEventsEnabled(true);

		StateChanged::dispatch(RoomModel::find($this->model->id));
	}

	public function lightToggle() {
		if ($this->model->light_state)
			$this->lightOff();
		else
			$this->lightOn();
	}

}
