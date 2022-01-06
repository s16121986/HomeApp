import LightRelay from "./light-relay";
import LightPwm from "./light-pwm";
import VacuumCleaner from "./vacuum-cleaner";
import ProjectorScreen from "./projector-screen";
import Curtains from "./curtains";
import Fan from "./fan";
import Device from "./device";
import WCFlowers from "./wc-flowers";
import WC from "./wc";
//import Fan from "./fan";

export default function controlFactory(device, params) {
	switch (device.type) {
		case 'App\\Home\\Devices\\LightPwm':
		case 'App\\Home\\Devices\\Light110':
			return new LightPwm(device, params);
		case 'App\\Home\\Devices\\LightRelay':
			return new LightRelay(device, params);
		case 'App\\Home\\Devices\\Fan':
			return new Fan(device, params);
		case 'App\\Home\\Devices\\VacuumCleaner':
			return new VacuumCleaner(device, params);
		case 'App\\Home\\Devices\\ProjectorScreen':
			return new ProjectorScreen(device, params);
		case 'App\\Home\\Devices\\Curtains':
			return new Curtains(device, params);
		case 'App\\Home\\Devices\\Flowers':
			return new WCFlowers(device, params);
		case 'App\\Home\\Devices\\WC':
			return new WC(device, params);
		//case 'curtains':
		//	return new Fan(device);
		//case 'projector_screen':
		//	return new Fan(device);
		default:
			return new Device(device, params);
	}
}
