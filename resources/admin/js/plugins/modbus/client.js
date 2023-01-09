import Request from "./request";
import Arg from "./param/Arg";
import BaudRate from "./param/BaudRate";
import Flag from "./param/Flag";
import Data from "./param/Data";
import Address from "./param/Address";
import Parity from "./param/Parity";
import StopBit from "./param/StopBit";
import BitCount from "./param/BitCount";
import Function from "./param/Function";

export default class Client {

	constructor(clientParams) {
		const container = $(clientParams.container);

		this.portParams = [
			new BaudRate(),
			new BitCount(),
			new StopBit(),
			new Parity()
		];

		let requestParams = [];
		requestParams[requestParams.length] = new Address(clientParams.modules);
		requestParams[requestParams.length] = new Function();
		//new paramNamespace.Arg('с', 'количество элементов');
		requestParams[requestParams.length] = new Arg('r', {
			label: 'Начальный регистр',
			placeholder: '0x0000'
		});
		requestParams[requestParams.length] = new Arg('c', {
			label: 'Количество регистров',
			placeholder: '0x0000'
		});
		requestParams[requestParams.length] = new Data();
		requestParams[requestParams.length] = new Flag('debug', {label: 'Режим отладки'});
		requestParams[requestParams.length] = new Arg('o', {
			label: 'Таймаут (мс)',
			default: 1000
		});
		//-0	Ноль. Уменьшает на единицу адрес, задаваемый аргументом -r.
		this.requestParams = requestParams;

		this.formFactory(container);
		this.requestLog = $('<div class="log request-log"></div>')
			.hide()
			.appendTo(container);
		this.responseLog = $('<div class="log response-log"></div>')
			.hide()
			.appendTo(container);
	}

	getPortParams() { return this.portParams; }

	getRequestParams() { return this.requestParams; }

	formFactory(container) {
		const form = $('<form></form>')
			.appendTo(container);

		const wrap = $('<div class="fieldset-wrap"></div>').appendTo(form);
		const portFieldset = $('<fieldset><legend>Настройки порта</legend></fieldset>')
			.appendTo(wrap);
		this.portParams.forEach(p => portFieldset.append(p.getEl()));

		const requestParams = this.requestParams;
		const requestFieldset = $('<fieldset><legend>Настройки запроса</legend></fieldset>')
			.appendTo(wrap);
		requestParams.forEach(p => requestFieldset.append(p.getEl()));

		$('<div class="btn-wrap"><button type="submit" class="btn-submit">Отправить</button></div>')
			.appendTo(form);

		form.submit((e) => {
			e.preventDefault();
			if (requestParams[2].getValue())
				this.send();
		});
	}

	send() {
		const req = new Request(this);
		this.requestLog.html(req.getCommand()).show();
		this.responseLog.addClass('loading').show();
		req.send((r) => {
			this.responseLog
				.html(r.response)
				.removeClass('loading');
		});
	}


}
