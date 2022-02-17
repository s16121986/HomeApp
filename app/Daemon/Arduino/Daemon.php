<?php

namespace App\Daemon\Arduino;

use App\Events\Sensors\ButtonHolded;
use App\Events\Sensors\ButtonPressed;
use App\Events\Sensors\ButtonReleased;
use App\Events\Sensors\MotionDetected;
use App\Models\Home\Device;

//use Arduino as ArduinoPort;
use Exception;

class Daemon {

	private $options = [];

	private $devices;

	public function __construct($device, array $options = []) {
		$this->options['device'] = $device;
	}

	public function __get(string $name) {
		return $this->options[$name] ?? null;
	}

	public function bootPort() {
//stty -F /dev/ttyACM0 cs8 9600 ignbrk -brkint -icrnl -imaxbel -opost -onlcr -isig -icanon -iexten -echo -echoe -echok -echoctl -echoke noflsh -ixon -crtscts raw
//stty -F /dev/ttyACM0 cs8 9600 ignbrk -brkint -icrnl -imaxbel -onlcr -echok -echoctl -echoke noflsh raw

		$flags = '9600 cs8';

		$flags .= ' cread clocal';
		$flags .= ' -crtscts';                                    // No Hardware flow Control
		$flags .= ' -opost';
		$flags .= ' -ixon -ixoff -ixany';                         // Disable XON/XOFF flow control both i/p and o/p
		$flags .= ' -echo -echoe -echonl -icanon -isig -iexten';  // Non Cannonical mode
		$flags .= ' ignbrk noflsh raw';

		$flags .= ' min 1 time 0';

		/*
		$flags .= ' clocal -crtscts -ixon -ixoff'; //confFlowControl
		$flags .= ' clocal -crtscts -ixon -ixoff';
		$flags .= ' clocal -crtscts -ixon -ixoff';
		$flags .= ' clocal -crtscts -ixon -ixoff';
		$flags .= ' clocal -crtscts -ixon -ixoff';*/
//$flags .= ' ignbrk -brkint -icrnl -imaxbel -opost -onlcr -isig -icanon -iexten -echo -echoe -echok -echoctl -echoke noflsh -ixon -crtscts -hupcl';

		exec('stty -F ' . $this->device . ' ' . $flags);
	}

	/*public function bootPort_() {
		$arduinoPort = new ArduinoPort();
		$arduinoPort->setPort('/dev/arduino');

		if (($i = $arduinoPort->open()) < 1)
			exit(1);

		register_shutdown_function(function () use ($arduinoPort) {
			$arduinoPort->close();
		});


		while (true) {
			while ($input = $arduinoPort->read()) {
				if (is_string($input))
					$readInput($input);
			}
			sleep(1);
		}
	}*/

	protected function boot() {
		$this->devices = [];
		$q = Device::where('module_id', 1)
			->whereEnabled();
		foreach ($q->cursor() as $device) {
			$this->devices[$device->channel] = $device;
		}
		unset($q);

		$this->bootPort();
	}

	public function run() {
		$this->boot();

		$h = fopen($this->device, 'rb');
		if (false === $h)
			throw new Exception('port unavailable');

		while (true) {
			$content = fread($h, 5);

			if (self::byte($content, 0) !== 62 || self::byte($content, 4) !== 255) {
				echo "broken\n";
				continue;
			}

			//$address = self::byte($content, 1);
			$pin = self::byte($content, 2);
			$event = self::byte($content, 3);

			if (!isset($this->devices[$pin]))
				continue;

			self::deviceEvent($event, $this->devices[$pin]);
		}

		fclose($h);
	}

	public static function byte($data, $i): int {
		if (isset($data[$i]))
			return ord($data[$i]);
		//return ($value === 255 ? 0 : $value);
		return 0;
	}

	public static function deviceEvent($event, $device) {
		switch ($event) {
			case 1:
				ButtonPressed::dispatch($device);
				break;
			case 2:
				ButtonReleased::dispatch($device);
				break;
			case 3:
				ButtonHolded::dispatch($device);
				break;
			case 4:
				MotionDetected::dispatch($device);
				break;
		}
	}

}
