<?php

namespace App\Http\Admin\Controllers;

use App\Home\ModuleFactory;
use App\Models\Home\Module;
use App\Repositories\HomeRepository;
use Illuminate\Http\Request;

class ModuleController extends Controller {

	public function index() {
		return $this->layout('module.index', [
			'title' => 'Модули управления',
			'script' => 'module/index',
			'rooms' => HomeRepository::rooms(),
			'modules' => Module::orderBy('name')->get()
		]);
	}

	public function edit(Request $request, $id) {
		$action = $this->action('edit', $id);

		$action->form()
			->addElement('room_id', 'select', [
				'label' => 'Комната',
				'required' => true,
				'items' => HomeRepository::rooms(),
				'emptyItem' => ''
			])
			->addElement('type', 'select', [
				'label' => 'Тип',
				'required' => true,
				'items' => ModuleFactory::getModulesList(),
				'emptyItem' => ''
			])
			->addElement('address', 'text', ['label' => 'Адрес', 'required' => false])
			->addElement('name', 'text', ['label' => 'Наименование', 'required' => true]);

		return $action
			->title('Новый модуль')
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
		return Module::class;
	}

}
