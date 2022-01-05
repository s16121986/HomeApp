function MenuItem(menu, options) {
	
	var T = this,
		el;

	function getHtml() {
		if (options === '-') {
			return '<div class="hr"></div>';
		}
		var attr = [],
			tag = 'div',
			html = [];
		if (T.href) {
			tag = 'a';
			attr[attr.length] = 'href="' + T.href + '"';
		}
		if (T.title) attr[attr.length] = ' title="' + T.title + '"';
		if (T.attr) attr[attr.length] = T.attr;
		attr[attr.length] = 'class="item' + (T.cls ? ' ' + T.cls : '') + '"';
		html[html.length] = '<' + tag + ' ' + attr.join(' ') + '>';
		if (T.icon) html[html.length] = '<i class="fa fa-' + T.icon + '"></i>';
		if (T.text) html[html.length] = '<span class="item-text">' + T.text + '</span>';
		if (undefined !== T.group) {
			html[html.length] = '<i class="flag ' + (T.checked ? 'checked' : '') + '"></i>';
		}
		html[html.length] = '</' + tag + '>';
		return html.join('');
	}
	function onclick(e) {
		e.stopPropagation();
		menu.trigger('itemclick', T);
		return false;
	}
	
	this.setOptions = function(options) {
		var i;
		for (i in options) {
			this[i] = options[i];
		}
		return this;
	};
	this.getEl = function() {
		if (!el) {
			el = $(getHtml());
			el.click(onclick);
		}
		return el;
	};
	this.setChecked = function(flag) {
		this.checked = flag;
		el.find('i')[flag ? 'addClass' : 'removeClass']('checked');
		return this;
	};
	
	if (typeof options === 'object') this.setOptions(options);
}
function Menu(options) {
	
	this.tail = false;
	this.autoclose = true;
	this.cls = null;
	this.disabled = false;
	this.items = [];
	
	var T = this,
		el, triggers = {};

	function onitemclick(item) {
		if (T.disabled) return;
		if (T.autoclose) T.close();
		if (item.group) {
			if (item.checked) return;
			var it, i, l = T.items.length;
			for (i = 0; i < l; i++) {
				it = T.items[i];
				if (it !== item && it.group === item.group && it.checked) {
					it.setChecked(false);
				}
			}
			item.setChecked(true);
		}
		if (item.handler) call_user_func(item.handler, item);
		if (T.handler) T.handler(item);
		if (item.href) document.location = item.href;
	}
	function ondocumentclick(e) {
		if (!el.is(e.target) && el.find(e.target).length === 0) {
			T.close();
		}
	}
	
	this.setOptions = function(options) {
		var i;
		if (options.items) {
			var item, l = options.items.length;
			for (i = 0; i < l;i++) {
				item = options.items[i];
				if (item !== '-' && isScalar(item)) item = {value: i, text: item};
				this.items[this.items.length] = new MenuItem(this, item);
			}
			delete options.items;
		}
		for (i in options) {
			this[i] = options[i];
		}
		return this;
	};
	this.setItems = function(items) {
		this.destroy();
		var i, item, l = items.length;
		for (i = 0; i < l;i++) {
			item = items[i];
			if (item !== '-' && isScalar(item)) item = {value: i, text: item};
			this.items[this.items.length] = new MenuItem(this, item);
		}
		return this;
	};
	this.getItem = function(index) {
		return this.items[index];
	};
	this.getEl = function() {
		if (!el) {
			el = $('<div class="menu' + (this.cls ? ' ' + this.cls : '') + '">' + (T.tail ? '<div class="tail"></div>' : '') + '</div>');
			var i, l = this.items.length;
			for (i = 0; i < l; i++) {
				el.append(this.items[i].getEl());
			}
			this.bind('itemclick', onitemclick);
		}
		return el;
	};
	this.show = function(position){
		if (this.autoclose && this.isHidden()) {
			$(document).click().bind('click touchstart', ondocumentclick);
		}
		if (!el) this.render();
		if (position) {
			var i, k, s = {};
			for (i in position) {
				this[i] = position[i];
				switch (i) {
					case 'x':k = 'left';break;
					case 'y':k = 'top';break;
					default:k = i;
				}
				this[k] = position[i];
				s[k] = position[i];
			}
		}
		/*var o = el.offset(), eh = el.outerHeight(), b = 10;
		if (window.innerHeight + window.scrollY < o.top + eh + b)
			el.css('top', o.top - eh - b);*/
		el.show();
		return this;
	};
	this.close = function(){
		el.hide();
		$(document).unbind('click touchstart', ondocumentclick);
		return this;
	};
	this.bind = function(action, callback) {
		if (!triggers[action]) triggers[action] = [];
		triggers[action].push(callback);
		return this;
	};
	this.trigger = function() {
		if (triggers[arguments[0]]) {
			var params = [],
				i, k = arguments.length, l = triggers[arguments[0]].length;
			for (i = 1; i < k; i++) {
				params[i - 1] = arguments[i];
			}
			for (i = 0; i < l;i++) {
				triggers[arguments[0]][i].apply(this, params);
			}
		}
		return this;
	};
	this.isHidden = function() {
		return (!el || el.is(':hidden'));
	};
	this.setDisabled = function(flag) {
		this.disabled = flag;
		return this;
	};
	this.setLoading = function(flag) {
		this.setDisabled(flag);
		if (flag) this.show();
		LoadingMask.set(el, flag);
		return this;
	};
	this.render = function(position) {
		this.renderTo.append(this.getEl());
		return this;
	};
	this.destroy = function() {
		this.items = [];
		if (el) {
			el.remove();
			el = null;
		}
		return this;
	};
	
	this.setOptions(options);
}