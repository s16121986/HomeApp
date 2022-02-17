<?php

namespace App\Listeners;

use App\Custom\Contracts\InteractsWithScenario;
use App\Enums\Scenario\CommandType;
use App\Home\DeviceFactory;
use App\Home\Home;
use App\Home\Room as HomeRoom;
use App\Models\Home\Device;
use App\Models\Home\Room;
use App\Notifications\MailEventNotification;
use App\Repositories\ActionRepository;
use App\Repositories\HomeRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class HomeEventSubscriber {

	public function handle($eventName, array $data) {
		$event = $data[0];
		if ($event instanceof InteractsWithScenario)
			$this->handleActions($event);
	}

	public function handleActions($event) {
		$actions = ActionRepository::getByEvent($event);
		foreach ($actions as $action) {
			foreach ($action->commands() as $c) {
				self::executeCommand($c);
				usleep(1);
			}
		}
	}

	public function subscribe($events) {
		return [
			//'App\Events\Sensors\*' => 'handle',
			'App\Events\*' => 'handle',
			//'Illuminate\Mail\Events\MessageSent' => 'logMail'
		];
	}

	private static function executeCommand($command): void {
		/*$entity = new $command->entity($command);
		$entity->handle();

		return;*/
		switch ($command->entity) {
			case Home::class:
				home()->command($command->command, $command->data);
				break;

			case Room::class:
				$room = HomeRoom::factory($command->entity_id);
				$room->command($command->command, $command->data);
				break;
			case Device::class:
				//if (isset(self::$devicesCache[$data['entity_id']]) && self::$devicesCache[$data['entity_id']] === $data['command'])
				$device = DeviceFactory::find($command->entity_id);
				//self::$devicesCache[$device->id] = $data->command;
				$device->command($command->command, $command->data);
				break;
			//case CommandType::SCENARIO:
			//$scenario = ScenarioManager::getScenario($data->entity_id);
			//return ScenarioManager::setCurrent($scenario, true);
		}
	}

}
