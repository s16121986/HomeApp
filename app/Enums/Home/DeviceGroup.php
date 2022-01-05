<?php

namespace App\Enums\Home;

use Enum;

abstract class DeviceGroup extends Enum {

    //const NONE = null;
    const SENSOR = 1;
    const DEVICES = 2;
    const LIGHT = 3;
    const PERIPHERALS = 4;

}
