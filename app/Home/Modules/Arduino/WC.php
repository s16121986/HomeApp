<?php

namespace App\Home\Modules\Arduino;

use App\Home\Modules\WirenBoard\AbstractModule;

class WC extends AbstractModule {

	const WC_ENABLED = 0;
	const WC_HALF_FLUSH = 1;
	const WC_FULL_FLUSH = 2;
	const FLOWERS_LIGHT = 3;
	const FLOWERS_WATER = 4;

	const WC_IR_MODE = 5;
	const FLOWERS_LIGHT_BRIGHTNESS = 7;

	public function wcEnable() {
		return $this->sendCoils(self::WC_ENABLED, 1);
	}

	public function wcDisable() {
		return $this->sendCoils(self::WC_ENABLED, 0);
	}

	public function wcFlush() {
		return $this->sendCoils(self::WC_FULL_FLUSH, 1);
	}

	public function wcHalfFlush() {
		return $this->sendCoils(self::WC_HALF_FLUSH, 1);
	}

	public function wcIrOff() {
		return $this->sendHolding(self::WC_IR_MODE, 0);
	}

	public function wcIrOn() {
		return $this->sendHolding(self::WC_IR_MODE, 1);
	}

	public function flowersLightOn() {
		return $this->sendCoils(self::FLOWERS_LIGHT, 1);
	}

	public function flowersLightOff() {
		return $this->sendCoils(self::FLOWERS_LIGHT, 0);
	}

	public function flowersLightToggle() {
		return $this->sendCoils(self::FLOWERS_LIGHT, 1 - $this->readCoils(self::FLOWERS_LIGHT));
	}

	public function flowersLightBrightness($brightness) {
		return $this->sendHolding(self::FLOWERS_LIGHT_BRIGHTNESS, $brightness);
	}

	public function flowersIrrigate() {
		return $this->sendCoils(self::FLOWERS_WATER, 1);
	}

}
