<?php
/**
 * https://wirenboard.com/wiki/index.php/WB-MDM3_230V_Dimmer
 * https://wirenboard.com/wiki/WB-MDM3_Registers
 */

namespace App\Home\Modules\WirenBoard;

class ACDimmer extends AbstractModule {

	const DIMMING_MODE_LEADING_EDGE = 0;
	const DIMMING_MODE_TRAILING_EDGE = 1;

	protected $productName = 'WB-MDM3';

	public function off($register) {
		return $this->dimming($register, 0);
	}

	public function dimming($register, int $brightness) {
		return $this->sendHolding($register, $brightness);
	}

	public function getBrightness($channel) {
		return $this->readHolding($channel);
	}

	/**
	 *    Режим управления внешними входами:
	 * 0 — управление отключено,
	 * 1 — однокнопочный режим,
	 * 2 — двухкнопочный режим
	 */
	public function controlMode($register, $mode) {
		return $this->sendHolding($register + 16, $mode);
	}

	/**
	 * Тип нагрузки канала:
	 * 0 — светодиодная или лампа накаливания,
	 * 1 — резистивная нагрузка
	 * 2 — ключевой режим (для версии 2.2.0 и выше)
	 */
	public function setLoadType($register, $type) {
		return $this->sendHolding($register + 50, $type);
	}

	/**
	 * Режим диммирования канала
	 * 0 — по переднему фронту или leading edge,
	 * 1 — по заднему фронту или trailing edge
	 */
	public function dimmingMode($register, $mode) {
		return $this->sendHolding($register + 60, $mode);
	}

	public function detectAC() {
		return $this->readInputRegisters(97);
	}

}
