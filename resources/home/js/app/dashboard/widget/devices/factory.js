import LightRelay from "./light-relay";
import LightPwm from "./light-pwm";
import Device from "./device";
import Fan from "./fan";

export default function widgetFactory(device, params) {
	switch (device.type) {
		case 'App\\Home\\Devices\\LightPwm':
		case 'App\\Home\\Devices\\Light110':
			return new LightPwm(device, params);
		case 'App\\Home\\Devices\\LightRelay':
			return new LightRelay(device, params);
		case 'App\\Home\\Devices\\Fan':
			return new Fan(device, params);
		//case 'curtains':
		//	return new Fan(device);
		//case 'projector_screen':
		//	return new Fan(device);
		default:
			return new Device(device, params);
	}
}
