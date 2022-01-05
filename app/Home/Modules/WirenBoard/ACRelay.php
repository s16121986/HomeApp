<?php
/**
 * https://wirenboard.com/wiki/index.php/WB-MDM3_230V_Dimmer
 * https://wirenboard.com/wiki/Relay_Module_Modbus_Management
 */

namespace App\Home\Modules\WirenBoard;

class ACRelay extends AbstractModule {

	protected $productName = 'WB-MR6CU v.2';

	public function sendState($register, $state) {
		return $this->sendCoils($register, $state);
	}

	public function readState($register) {
		return $this->readCoils($register);
	}

	public function on($register) {
		return $this->sendState($register, 1);
	}

	public function off($register) {
		return $this->sendState($register, 0);
	}

	public function toggle($register) {
		return $this->sendState($register, 1 - $this->readState($register));
	}

}
