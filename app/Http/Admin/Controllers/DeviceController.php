<?php

namespace App\Http\Admin\Controllers;

use App\Enums\Home\DeviceGroup;
use App\Models\Home\Device;
use App\Models\Home\DeviceType;
use App\Models\Scenario\Action;
use App\Repositories\HomeRepository;
use Illuminate\Http\Request;

class DeviceController extends Controller {

	public function index() {
		return app('layout')
			->title('Устройства')
			->script('device/index')
			->view('device.index', [
				'rooms' => HomeRepository::rooms(),
				'devices' => Device::orderBy('name')->get()
			]);
	}

	public function edit(Request $request, $id) {
		$action = $this->action('edit', $id);

		$action->form()
			->addElement('module_id', 'select', [
				'label' => 'Модуль',
				'required' => true,
				'items' => HomeRepository::modules(),
				'emptyItem' => ''
			])
			->addElement('type_id', 'select', [
				'label' => 'Тип',
				'required' => true,
				'items' => DeviceType::get(),
				'emptyItem' => ''
			])
			->addElement('group', 'enum', [
				'label' => 'Группа',
				'required' => true,
				'enum' => DeviceGroup::class,
				'emptyItem' => ''
			])
			//->addElement('key', 'text', ['label' => 'Ключ', 'required' => true])
			->addElement('name', 'text', ['label' => 'Наименование', 'required' => true])
			->addElement('enabled', 'checkbox', ['label' => 'Включен'])
			->addElement('usable', 'checkbox', ['label' => 'Доступно пользователю'])
			->addElement('channel', 'text', ['label' => 'Канал (Pin)'])
			->addElement('icon', 'text', ['label' => 'Иконка'])
			->addElement('timeout', 'text', ['label' => 'Таймаут включения'])
			->addElement('ya_enabled', 'checkbox', ['label' => 'Yandex станция'])
			->addElement('ya_name', 'text', ['label' => 'Yandex Наименование']);

		return $action
			->title('Новый модуль')
			//->script('module/edit')
			->submit();
	}

	public function view(Request $request, $id) {
		$device = Device::find($id);
		if (!$device)
			return abort(404);

		$foreignParam = function ($key) use ($device) {
			$idKey = $key . '_id';
			if ($device->$idKey)
				return '<a href="/' . $key . '/' . $device->$idKey . '/edit">' . $device->{$key . '_name'} . '</a>';
			else
				return '<i>Не задано</i>';
		};
		$data = $device->toArray();
		$data['room'] = $foreignParam('room');
		$data['module'] = $foreignParam('module');
		$data['type'] = $foreignParam('type');

		return app('layout')
			->title($device->room_name . ' / ' . $device->name)
			->ss('device/view')
			->view('device.view', [
				'device' => $device,
				'data' => $data,
				'actions' => Action::whereParent($device)->get()
			]);
	}

	public function create(Request $request) {
		return $this->edit($request, 'new');
	}

	public function delete(Request $request, $id) {
		return $this->action('delete', $id);
	}

	public function update(Request $request, $id) {
		$device = Device::find($id);
		if (!$device)
			return abort(404);

		$action = $request->input('action');

		$device->update([$action => !$device->$action]);

		return self::jsonResponse([$action => $device->$action]);
	}

	public static function model(): string {
		return Device::class;
	}

}
