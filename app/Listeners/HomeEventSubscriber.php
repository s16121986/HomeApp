<?php

namespace App\Listeners;

use App\Custom\Contracts\InteractsWithScenario;
use App\Enums\Scenario\CommandType;
use App\Home\Home;
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
			//foreach ($action->commands() as $c) {
			self::executeCommand($action);
			usleep(1);
			//}
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
				home()->room($command->entity_id)
					->command($command->command, $command->data);
				break;
			case Device::class:
				//if (isset(self::$devicesCache[$data['entity_id']]) && self::$devicesCache[$data['entity_id']] === $data['command'])
				$device = home()->device($command->entity_id);
				//self::$devicesCache[$device->id] = $data->command;
				$device->command($command->command, $command->data);
				break;
			//case CommandType::SCENARIO:
			//$scenario = ScenarioManager::getScenario($data->entity_id);
			//return ScenarioManager::setCurrent($scenario, true);
		}
	}

}
