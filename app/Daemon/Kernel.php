<?php

namespace App\Daemon;

use Illuminate\Contracts\Foundation\Application;

class Kernel {

	public Application $app;

	private array $bootstrappers = [
		\Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables::class,
		\Illuminate\Foundation\Bootstrap\LoadConfiguration::class,
		\Illuminate\Foundation\Bootstrap\HandleExceptions::class,
		\Illuminate\Foundation\Bootstrap\RegisterFacades::class,
		//\Illuminate\Foundation\Bootstrap\SetRequestForConsole::class,
		\Illuminate\Foundation\Bootstrap\RegisterProviders::class,
		\Illuminate\Foundation\Bootstrap\BootProviders::class,
	];

	public function __construct(Application $app) {
		$this->app = $app;
	}

	public function handle() {
		$this->bootstrap();

		//static::run();
	}

	public function bootstrap() {
		if (!$this->app->hasBeenBootstrapped())
			$this->app->bootstrapWith($this->bootstrappers);

		$this->app->loadDeferredProviders();
	}

}
