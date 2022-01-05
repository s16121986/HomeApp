<?php
/**
 * https://wirenboard.com/ru/product/WB-MRGBW-D/
 * https://wirenboard.com/wiki/index.php/WB-MRGBW-D
 * https://wirenboard.com/wiki/WB_Dimmers_Modbus_Registers_Map
 */

namespace App\Home\Modules\WirenBoard;

class LedDimmer extends AbstractModule {

	const R_CHANNEL = 1;
	const G_CHANNEL = 0;
	const B_CHANNEL = 2;
	const W_CHANNEL = 3;

	const MODE_STANDARD = 0;
	const MODE_DISABLE_CONTROL = 1;

	protected $productName = 'WB-MRGBW-D';

	public function getBrightness($channel) {
		return $this->readHolding($channel);
	}

	public function disableControl() {
		return $this->setMode(self::MODE_DISABLE_CONTROL);
	}

	public function setMode($mode) {
		return $this->sendHolding(5, $mode);
	}

	public function dimming($channel, int $percent) {
		return $this->sendHolding($channel, self::percentToDimmer($percent));
	}

	public function off($register) {
		return $this->dimming($register, 0);
	}

	private static function percentToDimmer($percent) {
		return round(255 * $percent / 100);
	}

}
