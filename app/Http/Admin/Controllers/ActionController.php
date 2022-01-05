<?php

namespace App\Http\Admin\Controllers;

use App\Custom\Contracts\InteractsWithScenario;
use App\Enums\Scenario\Condition;
use App\Home\Home;
use App\Models\Home\Device;
use App\Models\Home\Room;
use App\Models\Scenario\Action;
use App\Models\Scenario\Scenario;
use App\Repositories\HomeRepository;
use Illuminate\Http\Request;
use Exception;

class ActionController extends Controller {

	public function index() {
		return $this->layout('action.index', [
			'title' => 'Команды',
			'script' => 'action/index',
			'rooms' => HomeRepository::rooms(),
			'items' => Action::get()
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
			$entity = $action->model()->parent();
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
			->addElement('entity', 'select', [
				'label' => 'Обьект команды',
				'required' => true,
				'items' => self::getEntities(),
				'emptyItem' => ''
			])
			->addElement('entity_id', 'hidden', [])
			->addElement('command', 'text', ['label' => 'Команда', 'required' => true])
			->addElement('data', 'text', ['label' => 'Данные'])
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

			foreach (['parent', 'parent_id', 'entity_id'] as $k) {
				if (empty($data[$k]))
					$data[$k] = null;
			}

			$action->fill($data);
			$action->save();

			return $this->redirect(route('action.index'));
		} else if (!$action->new)
			$form->setModel($action->model());

		$metadata = [
			//'events' => self::loadEvents(),
			'scenarios' => HomeRepository::scenarios()->toArray(),
			'rooms' => HomeRepository::rooms(),
			'devices' => $devices,
			//'conditions' => Condition::labels(),
		];

		$this->meta->head->addMetaName('metadata', htmlspecialchars(json_encode($metadata)));

		$titlePrefix = '';/*match ($entity::class) {
			Device::class => $entity->room_name . ' / ' . $entity->name
		};*/

		return $action
			->title($titlePrefix . ' / Новый сценарий')
			->script('action/edit')
			->view('action.form');
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

}
