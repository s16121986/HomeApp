<?php

namespace App\Http\Admin\Actions;

use App\Helpers\Admin\Grid\Grid;

abstract class AbstractAction {

	protected static $routePrefix;

	protected $view;
	protected $controller;
	protected array $data = [];

	public function __construct($controller) {
		$this->controller = $controller;
	}

	public function __get(string $name) {
		return $this->data[$name] ?? null;
	}

	public function getKey(): string {
		return strtolower(str_replace(__NAMESPACE__ . '\\', '', get_class($this)));
	}

	public static function routeName($action): string {
		if (null === self::$routePrefix) {
			$routeName = request()->route()->getName();
			self::$routePrefix = substr($routeName, 0, strrpos($routeName, '.') + 1);
		}

		return self::$routePrefix . $action;
	}

	public function breadcrumbs() {
		return $this->controller->breadcrumbs();
	}

	public function menus() {

	}

	public function breadcrumb($title = null, $route = null, array $params = null): static {
		if (!$this->controller->breadcrumbs)
			$this->breadcrumbs();

		$breadcrumbs = $this->controller->breadcrumbs;
		$breadcrumbs->add($title ?? $this->title, $route, $params);

		return $this;
	}

	public function set($name, $value): static {
		$this->data[$name] = $value;
		return $this;
	}

	public function title($title): static {
		return $this->set('title', $title);
	}

	public function view($view): static {
		$this->view = $view;
		return $this;
	}

	public function style($style, $script = null): static {
		if ($script)
			$this->set('script', $script);
		$this->set('style', $style);
		return $this;
	}

	public function script($script): static {
		return $this->set('script', $script);
	}

	public function layout($view = null, array $data = null) {
		if (null === $data) {
			if (is_array($view))
				$data = $view;
			else if (is_string($view))
				$data = [];
			else if ($this->view) {
				$data = [];
				$view = $this->view;
			} else {
				$data = [];
				$view = request()->route()->getName();
			}
		}

		//if (!$this->controller->breadcrumbs)
		//	$this->breadcrumbs();

		//$this->menus();

		return app('layout')->view($view, array_merge($this->data, $data ?? []));
	}

}
