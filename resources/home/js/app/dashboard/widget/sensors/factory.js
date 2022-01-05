import Sensor from "./sensor";

export default function widgetFactory(sensor, params) {
	switch (sensor.type) {
		//case 'App\\Home\\Sensors\\Button':
		//	return new Button(device, params);
		default:
			return new Sensor(sensor, params);
	}
}
