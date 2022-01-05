<?php

namespace App\Models\Concerns;

use Illuminate\Support\Facades\DB;

class TabularSection {

	protected $model;

	protected $table;

	protected $attribute;

	protected $values;

	public function __construct($model, $table, $attribute) {
		$this->model = $model;

		$this->table = $table;

		$this->attribute = $attribute;
	}

	public function values($values = null) {
		if (null === $values) {
			if (null !== $this->values)
				return $this->values;

			return $this->values = DB::table($this->table)
				->where($this->model->getForeignKey(), $this->model->id)
				->pluck($this->attribute)
				->toArray();
		} else {
			DB::table($this->table)
				->where($this->model->getForeignKey(), $this->model->id)
				->delete();

			if ($values) {
				$insert = [];
				foreach (array_unique($values) as $id) {
					$insert[] = [
						$this->model->getForeignKey() => $this->model->id,
						$this->attribute => $id
					];
				}
				DB::table($this->table)
					->insert($insert);
			}
		}
	}

	public function find($value): bool {
		return in_array($value, $this->values());
	}

}
