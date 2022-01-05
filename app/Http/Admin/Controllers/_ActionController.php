<?php

namespace App\Http\Admin\Controllers;

use App\Models\Home\Device;
use App\Models\Home\DeviceType;
use App\Models\Scenario\Action;
use App\Repositories\HomeRepository;
use Illuminate\Http\Request;

class ActionController extends Controller {

	public function index() {
		return $this->layout('device.index', [
			'title' => 'Команды',
			'script' => 'action/index',
			'rooms' => HomeRepository::rooms(),
			'scenarios' => []
		]);
	}

	public function edit(Request $request, $id) {
		$action = $this->action('edit', $id);

		$action->form()
			->addElement('scenario_id', 'select', [
				'label' => 'Сценарий',
				'items' => [],//App::factory('Scenario\Scenario')->select(),
				'emptyItem' => '--Все--'
			])
			->addElement('room_id', 'select', [
				'label' => 'Комната',
				'items' => home()->rooms(),
				'emptyItem' => ''
			])
			->addElement('name', 'text', ['label' => 'Наименование', 'required' => true])
			->addElement('key', 'text', ['label' => 'Ключ'])
			->addElement('conditions', 'hidden', ['render' => false])
			->addElement('commands', 'hidden', ['render' => false]);

		return $action
			->title('Новый сценарий')
			//->script('module/edit')
			->submit();
	}

	public function create(Request $request) {
		return $this->edit($request, 'new');
	}

	public function delete(Request $request, $id) {
		return $this->action('delete', $id);
	}

	public static function model(): string {
		return Action::class;
	}

}
