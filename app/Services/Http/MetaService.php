<?php

namespace App\Services\Http;

use Gsdk\Meta\Page as MetaPage;

class MetaService {

	private static $instance;
	private static array $defaults = [
		'style' => 'main'
	];
	protected string $version = 'v117';
	protected $page;

	public static function setDefaults(array $data) {
		foreach ($data as $k => $v) {
			self::$defaults[$k] = $v;
		}
	}

	public static function instance(): MetaService {
		if (!self::$instance)
			self::$instance = new self();

		return self::$instance;
	}

	public static function boot($service) {
		$page = $service->page;
		$head = $page->getHead();
	}

	public function __construct() {
		$this->page = new MetaPage();
	}

	public function __call($name, $arguments) {
		return call_user_func_array([$this->page, $name], $arguments);
	}

	public function __get($name) {
		switch ($name) {
			case 'page':
				return $this->$name;
			case 'head':
				return $this->page->getHead();
		}

		return $this->page->$name;
	}

	public function configure(array $data): static {
		$this->addDefault();

		$data = array_merge(self::$defaults, $data);

		if (isset($data['title']))
			$this->setTitle($data['title']);

		$this->addPageMeta($data['style'] ?? 'main', $data['script'] ?? null);

		return $this;
	}

	public function addScript($src, array $attributes = []): MetaService {
		$this->head->addScript($src . '.js?' . $this->version, $attributes);
		return $this;
	}

	public function addStyle($href, array $attributes = []): MetaService {
		$this->head->addStyle($href . '.css?' . $this->version, $attributes);
		return $this;
	}

	public function addDefault(): MetaService {
		//app()->getLocale()
		$head = $this->head;
		$head
			->addMetaHttpEquiv('Content-Type', 'text/html; charset=utf-8')
			->addMetaHttpEquiv('Content-language', 'ru')
			->addMetaHttpEquiv('X-UA-Compatible', 'IE=edge,chrome=1')
			->addLinkRel('icon', '/images/favicon.ico')
			->addLinkRel('manifest', '/manifest.json')
			->addMetaName('viewport', 'width=device-width, initial-scale=1,minimum-scale=1,maximum-scale=1')
			->addMetaName('apple-mobile-web-app-title', env('APP_NAME'))
			->addMetaName('apple-mobile-web-app-capable', 'yes')
			//->addMetaName('apple-mobile-web-app-status-bar-style', 'black')
			->addLinkRel('apple-touch-icon', '/images/logo/152x152.png')
			->addMetaName('application-name', env('APP_NAME'))
			->addMetaName('mobile-web-app-capable', 'yes')
			->addLinkRel('shortcut icon', '/images/logo/196x196.png', ['sizes' => '196×196'])
			->addMetaName('viewport', 'width=device-width, initial-scale=1,minimum-scale=1,maximum-scale=1')
			->addMetaName('msapplication-TileColor', 'width=device-width, initial-scale=1,minimum-scale=1,maximum-scale=1')
			->addMetaName('msapplication-TileImage', 'width=device-width, initial-scale=1,minimum-scale=1,maximum-scale=1')
			->addMetaName('theme-color', 'width=device-width, initial-scale=1,minimum-scale=1,maximum-scale=1');

		foreach (['64x64', '128x128', '192x192'] as $size) {
			$head->addLinkRel('icon', '/images/logo/' . $size . '.png', ['type' => 'image/png', 'sizes' => $size]);
		}

		foreach (['OpenSans-Regular', 'OpenSans-Bold', 'OpenSans-SemiBold'] as $n) {
			$head->addLinkRel('preload', '/fonts/OpenSans/' . $n . '.ttf', ['as' => 'font', 'crossorigin' => 'anonymous']);
		}

		return $this;
	}

	public function addPageMeta($style, $script = null): MetaService {
		$head = $this->head;

		$head
			->addLinkRel('preload', '/css/' . $style . '.css?' . $this->version, ['as' => 'style'])
			->addStyle($style . '.css?' . $this->version)
			->addScript(($script ?? $style) . '.js?' . $this->version, ['defer' => true]);

		return $this;
	}

	public function isPrint() {
		$this->head->addStyle('print.css?' . $this->version);
	}

	public function addJsonLd(): MetaService {
		//Json Ld разметка страницы Organization, BreadcrumbList
		$htmlPage = $this->htmlPage;
		$baseUrl = App::getDomain(true);
		$social = [];
		foreach (App::factory('Reference\Social')->select(['auto' => true]) as $r) {
			$social[] = $r->url;
		}
		$jsonLd = $htmlPage->getJsonLd()
			->addOrganization([
				'url' => $baseUrl,
				'logo' => $baseUrl . '/images/logo/logo_ru.svg',
				'telephone' => App::get('contact_phone'),
				'sameAs' => $social
			]);

		$menuManager = $this->controller->get('menu');
		if ($menuManager->has('breadcrumbs') && !$menuManager->get('breadcrumbs')->isEmpty()) {
			$items = [];
			$a = $menuManager->get('breadcrumbs')->getItems();
			foreach ($a as $i => $item) {
				if (!$item->href)
					continue;
				$items[] = [
					'@type' => 'ListItem',
					'position' => $i + 1,
					'name' => $item->text,
					'item' => $baseUrl . $item->href
				];
			}
			$jsonLd->addBreadcrumbs(['itemListElement' => $items]);
		}
		return $this;
	}

}
