<?php

namespace App\Listeners;

use App\Events\Broadcasting\WebSocketEvent;
use App\Events\Home\ScenarioSelected;
use App\Home\DeviceFactory;
use App\Home\Room;
use App\Models\Home\Room as RoomModel;
use App\Models\Home\Device;
use App\Models\Home\Sensors;
use App\Models\Scenario\Scenario;
use App\Notifications\MailEventNotification;
use App\Observers\Home\DeviceObserver;

class WebSocketEventSubscriber {

	public function handle($event) {
		$result = $this->resolveEvent($event);
		if (null === $result)
			return;

		$event->connection->send(json_encode([
			'id' => $event->id,
			'result' => $result
		]));
	}

	public function homeGetInfo() {
		return [
			'home' => RoomModel::home()->toArray(),
			'rooms' => RoomModel::rooms()->toArray(),
			'devices' => Device::whereEnabled()
				->where('home_devices.usable', 1)
				->get()->toArray(),
			'scenarios' => Scenario::whereEnabled()->get()->toArray(),
			'sensors' => Sensors::get()->toArray(),
			'settings' => home()->settings()->getData()
		];
	}

	public function homeSendCommand($event) {
		home()->command($event->action, $event->data);
	}

	public function roomSendCommand($event) {
		$room = new Room(RoomModel::find($event->room_id));
		$room->command($event->action, $event->data);
	}

	public function deviceSendCommand($event) {
		$device = DeviceFactory::find($event->device_id);
		if (!$device)
			return;

		DeviceObserver::setRoomLightsEvents(true);

		$device->command($event->action, $event->data);

		DeviceObserver::setRoomLightsEvents(false);
	}

	public function scenarioSet($event) {
		$scenario = Scenario::find($event->scenario_id);
		if ($scenario && $scenario->enabled)
			ScenarioSelected::dispatch($scenario);
	}

	public function resolveEvent($event) {
		switch ($event->method) {
			case 'ping':
				return 'pong';
			case 'home.sendCommand':
				return $this->homeSendCommand($event);
			case 'room.sendCommand':
				return $this->roomSendCommand($event);
			case 'device.sendCommand':
				return $this->deviceSendCommand($event);
			case 'scenario.set':
				return $this->scenarioSet($event);
			case 'home.getInfo':
				return $this->homeGetInfo();
		}
	}

	public function subscribe($events) {
		return [
			//WebSocketEvent::class => 'handle',
		];
	}

}
