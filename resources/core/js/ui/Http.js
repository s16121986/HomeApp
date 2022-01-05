Http = new function(){

	function HttpRequest(params) {

		this.send = function(){
			const response = new HttpResponse(params);
			const ajaxParams = $.extend({}, params);
			ajaxParams.error = function(xhr, status, error){
				response.init({error: {code: status, message: error}}, 'error', xhr);
			};
			ajaxParams.success = function(result, status, xhr){ response.init(result, status, xhr); };
			$.ajax(ajaxParams);
			return response;
		};
	}

	function HttpResponse(params) {

		this.init = function(result, status, xhr) {
			if (typeof result === 'string' && '{' === result.substr(0, 1))
				result = JSON.parse(result);
			if (result.success === false || result.error)
				status = 'error';

			switch (result.action) {
				case 'reload': Http.reload(); return;
				case 'redirect': Http.redirect(result.url); return;
				case 'window-open': WindowManager.open(result.window); break;
			}

			//console.log(result, status, xhr);
			this.trigger(status, [result, status, xhr]);
		};
		this.trigger = function(method, args) {
			if (typeof params[method] === 'function')
				params[method].apply(this, args);
		};
	}

	let logoutFlag = false;
	var query = new function () {
		let data = {};

		this.get = function (name) {
			return data[name] ? data[name] : null;
		};

		(function(){
			let params = new URLSearchParams(window.location.search);
			for (let r of params.entries()) {
				if (r[0].indexOf('[]') > -1) {
					let n = r[0].substring(0, r[0].length - 2);
					if (!data[n])
						data[n] = [];
					data[n][data[n].length] = r[1];
				} else
					data[r[0]] = r[1];
			}
		})();
	};

	function error(xhr, status, error) {
		switch (status) {
			case 'Not found':
				//check auth
				if (logoutFlag) Loader.ping();

				break;
			case ''://offline
			default:
				//nothing
		}
	}

	async function send(args, params) {
		if (typeof args[1] === 'function') {
			args[2] = args[1];
			args[1] = null;
		}
		if (typeof args[0] === 'object')
			params = $.extend({}, args[0], params);
		else
			params = $.extend({
				url: args[0],
				data: args[1],
				success: args[2],
				dataType: args[3]
			}, params);
		const request = new HttpRequest(params);
		const response = request.send();
	}

	this.getJSON = async function(url, data, success) { return send(arguments, {dataType: 'json'}); };
	this.get = async function(url, data, success, dataType) { return send(arguments, {method: 'get'}); };
	this.post = async function(url, data, success, dataType) { return send(arguments, {method: 'post'}); };
	this.ajax = async function(data){ return send(arguments); };
	this.redirect = function(url) { document.location = url; };
	this.reload = function(noConfirmMsg) {
		if (false !== noConfirmMsg) {
			window.noBefereUnloadMesage = true;
		}
		location.reload(true);
	};
	this.getQuery = function () { return query; };

};
