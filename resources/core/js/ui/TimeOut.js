function TimeOut(callback, timeout) {
	var self = this, _wt;
	var callbacks = [];
	
	if (typeof callback !== 'function') {
		timeout = callback;
		callback = null;
	}
	
	var handler = function() {
		for (let i = 0, l = callbacks.length; i < l; i++)
			callbacks[i][0].call(self, callbacks[i][1]);
	};
	
	this.start = function() { if (!this.isStarted()) { _wt = window.setTimeout(handler, timeout); } };
	this.stop = function() { if (this.isStarted()) { window.clearTimeout(_wt);_wt = undefined; } };
	this.isStarted = function() { return _wt !== undefined; };
	this.bind = function(fn, params) { callbacks[callbacks.length] = [fn, params];return this; };
	
	if (callback)
		this.bind(callback).start();
	
}