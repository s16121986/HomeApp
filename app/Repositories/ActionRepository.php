<?php

namespace App\Repositories;

use App\Enums\Scenario\Condition;
use App\Models\Scenario\Action;

class ActionRepository {

	private static $actions;

	public static function actions() {
		return self::$actions ?? self::$actions = Action::whereEnabled()->get();
	}

	public static function getByEvent($event): array {
		$actions = [];
		$query = Action::whereEnabled()
			->whereEvent($event)
			->whereParent($event->actionEntity());

		foreach ($query->cursor() as $action) {
			if (self::checkConditions($event, $action))
				$actions[] = $action;
		}

		return $actions;
	}

	private static function getConditionValue($condition, $event) {
		switch ($condition->type) {
			/*case Condition::EVENT:
				return is_numeric($condition->value) ? ($event->code ?? 0) : $event::class;//TODO deprecated
			case Condition::EVENT_DATA:
				return $event->data;*/
			case Condition::ROOM:
				return $event->room_id;
			case Condition::DEVICE:
				return $event->device_id;
			/*case Condition::SCENARIO:
				return $event->scenario_id;*/
			case Condition::DAYTIME:
				return home()->getDaytime();
			case Condition::DEVICE_STATE:
				return HomeRepository::device($condition->device_id)->state;
		}

		return null;
	}

	private static function checkConditions($event, $action): bool {
		/*if ($action->id == 17) {
			var_dump($action->room_id, $event->room_id);
		}*/
		/*if ($action->room_id && $action->room_id != $event->room_id)
			return false;*/
		/*if ($action->event !== $event::class)
			return false;

		if (!$event->actionWhen($action))
			return false;*/

		foreach ($action->conditions() as $c) {
			$handler = new $c->type($c);
			if (!$handler->handle()) {
				return false;
			}
		}

		return true;

		$conditions = [];
		foreach ($action->conditions() as $c) {
			$conditions[] = new $c->type($c);
		}//$action->conditions()->all();

		while ($conditions) {
			$c = array_shift($conditions);

			$flag = $c->handle();

			foreach ($conditions as $i => $rc) {
				if ($c->type !== $rc->type)
					continue;

				unset($conditions[$i]);

				if (!$flag && $rc->handle())
					$flag = true;
			}

			if (!$flag)
				return false;
		}

		return true;
	}

}
