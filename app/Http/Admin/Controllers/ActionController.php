<?php

namespace App\Http\Admin\Controllers;

use App\Custom\Contracts\InteractsWithScenario;
use App\Models\Scenario\Condition;
use App\Home\Home;
use App\Models\Home\Device;
use App\Models\Home\Room;
use App\Models\Scenario\Action;
use App\Models\Scenario\Command;
use App\Models\Scenario\Scenario;
use App\Repositories\HomeRepository;
use Illuminate\Http\Request;
use Form;
use Exception;

class ActionController extends Controller {

	public function index() {
		return app('layout')
			->title('Команды')
			->script('action/index')
			->view('action.index', [
				'rooms' => HomeRepository::rooms(),
				'items' => Action::get()
			]);
	}

	public function view(Request $request, $id) {
		$action = Action::find($id);
		if (!$action)
			return abort(404);

		$data = $action->toArray();
		$parent = $action->parent();
		$data['event'] = lang($data['event']);
		$data['parent'] = $parent ? ($parent . ' (' . $parent->id . ')') : '';

		$devices = [];
		foreach (HomeRepository::devices() as $device) {
			$devices[] = ['id' => $device->id, 'name' => $device->room_name . ' / ' . $device->name];
		}
		$metadata = [
			'id' => $id,
			'events' => self::loadEvents(),
			'scenarios' => HomeRepository::scenarios()->toArray(),
			'rooms' => HomeRepository::rooms(),
			'devices' => $devices,
		];

		$this->meta->head
			->addMetaName('metadata', htmlspecialchars(json_encode($metadata)));

		return app('layout')
			->title($action->name)
			->ss('action/view')
			->view('action.view', [
				'action' => $action,
				'conditions' => $action->conditions(),
				'commands' => $action->commands(),
				'data' => $data
			]);
	}

	public function edit(Request $request, $id) {
		$action = $this->action('edit', $id);

		if ($action->new) {
			/*$cls = match ($request->input('entity')) {
				'device' => Device::class,
				//default => throw new Exception('parent undefined')
			};
			//$entity = $cls::find($request->input('entity_id'));
			//if (!$entity)
			//	return abort(404);*/
		} else {
			//$entity = $action->model()->parent();
		}

		$devices = [];
		foreach (HomeRepository::devices() as $device) {
			$devices[] = ['id' => $device->id, 'name' => $device->room_name . ' / ' . $device->name];
		}

		$form = $action->form()
			->addElement('name', 'text', ['label' => 'Наименование', 'required' => true])
			->addElement('parent', 'select', [
				'label' => 'Обьект события',
				'items' => self::getParents(),
				'emptyItem' => ''
			])
			->addElement('parent_id', 'hidden')
			->addElement('event', 'select', [
				'label' => 'Событие',
				'required' => true,
				'items' => self::loadEvents(),
				'emptyItem' => ''
			])
			->addElement('enabled', 'checkbox', ['label' => 'Включен'])/*->addElement('device_id', 'select', [
				'label' => 'Устройство',
				'items' => $devices,
				'emptyItem' => ''
			])
			->addElement('scenario_id', 'select', [
				'label' => 'Сценарий',
				'items' => HomeRepository::scenarios(),
				'emptyItem' => ''
			])*/
		;

		if ($form->submit()) {
			$data = $form->getData();
			$action = $action->model();

			foreach (['parent', 'parent_id'] as $k) {
				if (empty($data[$k]))
					$data[$k] = null;
			}

			$action->fill($data);
			$action->save();

			return $this->redirect(route('action.index'));
		} else if (!$action->new) {
			$form->setModel($action->model());
			$value = [];
		}

		$metadata = [
			//'events' => self::loadEvents(),
			'scenarios' => HomeRepository::scenarios()->toArray(),
			'rooms' => HomeRepository::rooms(),
			'devices' => $devices,
			//'conditions' => self::getConditions(),
		];

		app('layout')->addMetaVariable('metadata', $metadata);

		$titlePrefix = '';/*match ($entity::class) {
			Device::class => $entity->room_name . ' / ' . $entity->name
		};*/

		return $action
			->title($titlePrefix . ' / Новый сценарий')
			->script('action/edit')//->view('action.form')
			;
	}

	public function create(Request $request) {
		return $this->edit($request, 'new');
	}

	public function delete(Request $request, $id) {
		return $this->action('delete', $id);
	}

	public function update(Request $request, $id) {
		$action = Action::find($id);
		if (!$action)
			return abort(404);

		$key = $request->input('action');

		$action->update([$key => !$action->$key]);

		return self::jsonResponse([$key => $action->$key]);
	}

	public function event(Request $request, $id) {
		$action = Action::find($id);
		if (!$action)
			return abort(404);


		return view('window.form', [
			'title' => $action->name,
			'action' => $action
		]);
	}

	public function condition(Request $request, $id) {
		$action = Action::find($id);
		if (!$action)
			return abort(404);

		$commandId = $request->input('id');
		if ($commandId === 'new')
			$condition = new Condition();
		else {
			$condition = Condition::find($commandId);
			if (!$condition)
				return abort(404);
			else if ($request->input('delete')) {
				$condition->delete();
				return $this->redirect('/action/' . $id);
			}
		}

		$form = new Form('data');
		$form
			->addElement('type', 'select', [
				'label' => 'Условие',
				'required' => true,
				'items' => self::getConditions(),
				'emptyItem' => ''
			])
			->addElement('expression', 'select', [
				'label' => 'Выражение',
				'required' => true,
				'items' => [
					'=' => 'Равно',
					'!=' => 'Не равно',
					'>' => 'Больше',
					'<' => 'Меньше',
					//'between' => 'Интервал',
					'in' => 'Одно из',
					'not in' => 'Ни одно из'
				]
			])
			->addElement('data', 'hidden', []);

		if ($form->submit()) {
			$data = $form->getData();
			$data['action_id'] = $id;

			$condition->fill($data);
			$condition->save();

			return self::jsonReload();
		} else
			$form->setData($condition->toArray());

		return view('window.form', [
			'title' => $action->name,
			'form' => $form,
			'cls' => 'window-condition',
			'deleteUrl' => $condition->id ? ('/action/' . $id . '/condition?delete=1&id=' . $condition->id) : null
		]);
	}

	public function command(Request $request, $id) {
		$action = Action::find($id);
		if (!$action)
			return abort(404);

		$commandId = $request->input('id');
		if ($commandId === 'new')
			$command = new Command();
		else {
			$command = Command::find($commandId);
			if (!$command)
				return abort(404);
			else if ($request->input('delete')) {
				$command->delete();
				return $this->redirect('/action/' . $id);
			}
		}

		$form = new Form('data');
		$form
			->addElement('entity', 'select', [
				'label' => 'Обьект команды',
				'required' => true,
				'items' => self::getEntities(),
				'emptyItem' => ''
			])
			->addElement('entity_id', 'hidden', [])
			->addElement('command', 'text', ['label' => 'Команда', 'required' => true])
			->addElement('data', 'text', ['label' => 'Данные']);

		if ($form->submit()) {
			$data = $form->getData();
			$data['action_id'] = $id;
			if (!$data['entity_id'])
				$data['entity_id'] = null;

			$command->fill($data);
			$command->save();

			return self::jsonReload();
		} else
			$form->setData($command->toArray());

		return view('window.form', [
			'title' => $action->name,
			'form' => $form,
			'cls' => 'window-command',
			'deleteUrl' => $command->id ? ('/action/' . $id . '/command?delete=1&id=' . $command->id) : null
		]);
	}

	public static function model(): string {
		return Action::class;
	}

	private static function loadEvents($path = '/'): array {
		$events = [];
		$namespace = 'App\Events' . str_replace('/', '\\', $path);
		$eventsPath = app_path('Events' . $path);

		$handle = opendir($eventsPath);
		while (false !== ($entry = readdir($handle))) {
			if ($entry === '.' || $entry === '..')
				continue;

			$filename = $eventsPath . DIRECTORY_SEPARATOR . $entry;
			if (is_dir($filename)) {
				foreach (self::loadEvents($path . $entry . '/') as $event) {
					$events[] = $event;
				}
			} else {
				$name = substr($entry, 0, -4);
				if (str_starts_with($name, 'Abstract'))
					continue;
				$class = $namespace . $name;
				$a = class_implements($class);
				if (in_array(InteractsWithScenario::class, $a))
					$events[] = [
						'id' => $class,
						'name' => lang($class)
					];
			}
		}
		closedir($handle);

		return $events;
	}

	private static function getParents() {
		return [
			Home::class => lang(Home::class),
			Device::class => lang(Device::class),
			Room::class => lang(Room::class),
			Scenario::class => lang(Scenario::class)
		];
	}

	private static function getEntities() {
		return [
			Home::class => lang(Home::class),
			Device::class => lang(Device::class),
			Room::class => lang(Room::class),
			Scenario::class => lang(Scenario::class)
		];
	}

	private static function getConditions() {
		$conditions = [];
		$namespace = 'App\Entities\Scenario\Condition\\';
		$eventsPath = app_path('Entities/Scenario/Condition');

		$handle = opendir($eventsPath);
		while (false !== ($entry = readdir($handle))) {
			if ($entry === '.' || $entry === '..')
				continue;

			$name = substr($entry, 0, -4);
			if (str_starts_with($name, 'Abstract'))
				continue;

			$class = $namespace . $name;
			$conditions[] = [
				'id' => $class,
				'name' => lang($class)
			];
		}
		closedir($handle);

		return $conditions;
	}

}
