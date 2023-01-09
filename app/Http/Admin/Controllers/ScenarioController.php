<?php

namespace App\Http\Admin\Controllers;

use App\Events\Sensors\ButtonPressed;
use App\Models\Home\Device;
use App\Models\Scenario\Scenario;
use Illuminate\Http\Request;

class ScenarioController extends Controller {

	public function index() {
		$device = Device::find(22);
		ButtonPressed::dispatch($device);
		return app('layout')
			->title('Сценарии')
			->script('scenario/index')
			->view('scenario.index', [
				'items' => Scenario::get()
			]);
	}

	public function edit(Request $request, $id) {
		$action = $this->action('edit', $id);

		$action->form()
			->addElement('name', 'text', ['label' => 'Наименование', 'required' => true])
			->addElement('icon', 'text', ['label' => 'Иконка']);

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

	public function update(Request $request, $id) {
		$scenario = Scenario::find($id);
		if (!$scenario)
			return abort(404);

		$action = $request->input('action');

		$scenario->update([$action => !$scenario->$action]);

		return self::jsonResponse([$action => $scenario->$action]);
	}

	public static function model(): string {
		return Scenario::class;
	}

}
