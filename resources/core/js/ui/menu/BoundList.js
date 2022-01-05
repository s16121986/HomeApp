function BoundList(options) {
	
	function Item(menu, options) {
		this.type = 'item';
		this.selectable = false;
		var T = this,
			el;
	
			
		if (options === '-') options = {type: 'hr', selectable: false};
		else {
			switch (options.type) {
				case 'group':break;
				case 'hr':
					options.selectable = false;
					break;
				case 'reset':
				case 'item':
				case 'option':
				default:
					T.type = 'option';
					T.selectable = true;
					break;
			}
		}

		function getHtml() {
			switch (T.type) {
				case 'hr':return '<div class="item_hr"></div>';
				case 'reset':return ['<div class="item item_reset"><i></i>', T.text, '</div>'].join('');
				case 'group':
					var html = ['<div class="item item_group',
						//(T.selected ? ' selected' : ''),
						(T.cls ? ' ' + T.cls : ''), '">'];
					html[html.length] = '<div class="label">' + T.text + '<i></i></div>';
					html[html.length] = '<div class="items"></div>';
					html[html.length] = '</div>';
					return html.join('');
				default:
					var html = ['<div class="item item_option',
						(T.selected ? ' selected' : ''),
						(T.checked ? ' checked' : ''),
						(T.cls ? ' ' + T.cls : ''), '">'];
					if (T.group) html[html.length] = '<i class="flag"></i>';
					html[html.length] = T.text;
					html[html.length] = '</div>';
					return html.join('');
			}
		}
		function onclick(e) {
			e.stopPropagation();
			e.preventDefault();
			if (T.type === 'group' || !T.selectable) return;
			menu.trigger('itemclick', T);
		}

		this.setOptions = function(options) {
			var i;
			for (i in options) {
				this[i] = options[i];
			}
			this.text = this.text || this.name || this.presentation;
			this.value = this.value || this.id;
			return this;
		};
		this.getEl = function() {
			if (!el) {
				el = $(getHtml());
				switch (T.type) {
					case 'group':
						el.find('div.label').click(function(){el.toggleClass('collapsed');});
						break;
					default:
						if (T.selectable) el.click(onclick);
				}
			}
			return el;
		};
		this.select = function() {
			if (this.selected) return this;
			this.selected = true;
			if (el) el.addClass('selected');
			return this;
		};
		this.deselect = function() {
			if (!this.selected) return this;
			this.selected = false;
			if (el) el.removeClass('selected');
			return this;
		};
		this.hide = function() {
			el.hide();
			return this;
		};
		this.show = function(){
			el.show();
			return this;
		};
		this.isHidden = function() {
			return (!el || el.is(':hidden'));
		};
		this.setChecked = function(flag) {
			if (el) el[flag ? 'addClass' : 'removeClass']('checked');
			this.checked = flag;
			return this;
		};

		if (typeof options === 'object') this.setOptions(options);
	}
	
	this.multiple = false;
	this.cls = null;
	this.disabled = false;
	this.allowDeselect = false;
	this.groupSelectable = false;
	this.filterEnabled = false;
	this.enableKeyNav = true;
	this.groupDataIndex = 'parent_id';
	this.items = [];
	
	const T = this;
	let selected = [], cursor = 0,
		initialized = false,
		el, triggers = {};

	function onitemclick(item) {
		if (T.disabled) return;
		updateCursor(item.index);
		switch (item.type) {
			case 'reset':
				T.deselectAll();
				break;
			default:
				if (item.selected && true !== options.unselectable) T.deselect(item.value);
				else T.select(item.value);
		}
		if (T.filterEnabled && T.input) {
			T.input.val('').change().focus();
			filter();
		}
		if (item.handler) item.handler(item);
		if (item.href) location = item.href;
		if (T.handler) T.handler(item);
		if (T.multiple) {}
		else T.close();
	}
	function close() {
		T.close();
	}
	function ondocumentclick(e) {
		if (!el || el.is(e.target) || el.find(e.target).length > 0
			|| (T.input && T.input.is(e.target))
				)
			return;
		close();
	}
	function onkeydown(e) {
		switch (e.keyCode) {
			case 38://up
				cursor--;
				var items = el.find('div.item_option:not(:hidden)');
				if (cursor < 0) cursor = items.length - 1;
				updateCursor();
				return false;
			case 40://down
				cursor++;
				var items = el.find('div.item_option:not(:hidden)');
				if (cursor === items.length) cursor = 0;
				updateCursor();
				return false;
			case 13://enter
				e.preventDefault();
				el.find('div.item_option.focused').click();
				return false;
		}
		if (T.filterEnabled && T.input) window.setTimeout(filter, 10);
	}
	function deselect(value, fireEvent) {
		var i = 0, l = selected.length;
		for (; i < l; i++) {
			if (selected[i] == value) {
				selected.splice(i, 1);
				if (false !== fireEvent) {
					T.trigger('change', selected);
				}
				updateSelection();
				return true;
			}
		}
		return false;
	}
	function updateSelection() {
		var i, l = T.items.length;
		for (i = 0; i < l;i ++) {
			if (T.isSelected(T.items[i].value)) T.items[i].select();
			else T.items[i].deselect();
		}
	}
	function updateCursor(i) {
		if (!T.enableKeyNav) return;
		if (i !== undefined) cursor = i;
		el.find('div.item_option.focused').removeClass('focused');
		el.find('div.item_option:not(:hidden):eq(' + cursor + ')').addClass('focused');
	}
	function updateItems() {
		cursor = 0;
		//selected = [];
		if (!el) return;
		el.html('');
		var i, l = T.items.length;
		for (i = 0; i < l; i++) {
			if (!T.items[i][T.groupDataIndex]) {
				el.append(T.items[i].getEl());
			}
		}
		if (T.groups && T.groups.length > 0) {
			var j, k = T.groups.length,
				group, gm;
			for (i = 0; i < k; i++) {
				group = T.groups[i].getEl();
				gm = group.find('div.items');
				for (j = 0; j < l; j++) {
					if (T.items[j][T.groupDataIndex] == T.groups[i].id) {
						gm.append(T.items[j].getEl());
					}
				}
				el.append(group);
			}
		}
		updateCursor();
	}
	function filter() {
		var s = T.input.val(),
			li = el.find('div.item').show();
		if (s) {
			var v = getSpellVariants(s.toLowerCase());
			li.each(function(){
				var t = this.innerHTML.toLowerCase();
				if (!searchSpellVariants(t, v)) {
					$(this).hide();
				}
			});
			cursor = 0;
			updateCursor();
		}
	}
	
	this.getValuePresentation = function(value) {
		if (undefined === value) {
			var html = [], i, l = selected.length;
			for (i = 0;i < l; i++) {
				html[html.length] = '<span>' + this.getValuePresentation(selected[i]) + '</span>';
			}
			if (html.length === 0) html = [T.emptyItem];
			return html.join('');
		}
		var i, l = T.items.length;
		for (i = 0; i < l;i++) {
			if (T.items[i].value == value) {
				return T.items[i].text;
			}
		}
		//return '';
	};
	this.isSelected = function(value, values) {
		if (!values) {
			values = selected;
		}
		var i = 0, l = values.length;
		for (; i < l; i++) {
			if (values[i] == value) {
				return true;
			}
		}
		return false;
	};
	this.isEmpty = function() {
		return (selected.length === 0);
	};
	this.setValue = function(value) {
		var changed = true;
		if (this.multiple) {
			selected = $.extend([], value) || [];
		} else {
			if (value) {
				changed = (0 === selected.length || value !== selected[0]);
				selected = [value];
			} else {
				changed = (selected.length > 0);
				selected = [];
			}
		}
		updateSelection();
		if (changed) this.trigger('change', selected);
		return this;
	},
	this.getValue = function() {
		return (this.multiple ? selected : selected[0]);
	};
	this.select = function(value) {
		if (this.isSelected(value)) {
			return false;
		}
		if (!this.multiple && selected.length > 0) deselect(selected[0], false);
		selected[selected.length] = value;
		updateSelection();
		this.trigger('select', value).trigger('change', selected);
		return true;
	};
	this.selectAll = function() {
		this.setValue([]);
		return true;
	};
	this.deselect = function(value) {
		return deselect(value, true);
	};
	this.deselectAll = function() {
		this.setValue(null);
		return true;
	};
	this.toggle = function(value) {
		if (this.isSelected(value)) {
			if (this.allowDeselect) {
				return this.deselect(value);
			}
		} else {
			return this.select(value);
		}
		return false;
	};
	this.getEl = function() {
		if (!el) {
			el = $('<div class="boundlist' + (this.cls ? ' ' + this.cls : '') + '"></div>');
			if (this.renderTo) this.render(this.renderTo);
			updateItems();
			if (!initialized) {
				initialized = true;
				this.bind('itemclick', onitemclick);
			}
		}
		return el;
	};
	this.show = function() {
		//if (!this.hasItems()) return;
		if (this.isHidden()) {
			$(document)
				.trigger('popup')
				.one('popup', close)
				.click(ondocumentclick);
		} else return this;
		if (!el) this.render();
		el.show();
		if (this.enableKeyNav) $(this.input || document).keydown(onkeydown);
		this.trigger('show');
		/*if (this.input) {
			if (!this.multiple) {
				var v = this.getValue();
				this.input.val(v ? this.getValuePresentation(v) : '').change();
			}
			this.input.select();
		}*/
		return this;
	};
	this.close = function() {
		if (el && !this.isHidden()) {
			el.hide();
			$(document)
				.unbind('click', ondocumentclick)
				.unbind('popup', close);
			if (this.enableKeyNav) $(this.input || document).unbind('keydown', onkeydown);
			this.trigger('close');
		}
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
	this.render = function(position) {
		this.renderTo.append(this.getEl());
		updateSelection();
		updateCursor();
		return this;
	};
	this.setOptions = function(options) {
		var i;
		if (options.items) {
			this.setItems(options.items);
			delete options.items;
		}
		if (options.groups) {
			this.setGroups(options.groups);
			delete options.groups;
		}
		if (options.value) {
			if (this.multiple) {
				selected = (typeof options.value === 'object' ? options.value : [options.value]);
			} else {
				selected = [options.value];
			}
			delete options.value;
		}
		if (options.selected) selected = options.selected;
		for (i in options) {
			this[i] = options[i];
		}
		return this;
	};
	this.setGroups = function(groups) {
		if (el) {
			el.remove();
			el = null;
			cursor = 0;
			selected = [];
		}
		this.groups = [];
		var i, l = groups.length;
		for (i = 0; i < l;i++) {
			this.groups[this.groups.length] = new Item(this, $.extend(groups[i], {type: 'group'}));
		}
		return this;
	};
	this.setItems = function(items) {
		this.items = [];
		var j = 0, i, l = items.length, item;
		for (i = 0; i < l;i++) {
			item = new Item(this, items[i]);
			if (item.type === 'option') item.index = j++;
			this.items[this.items.length] = item;
		}
		updateItems();
		return this;
	};
	this.hasItems = function() {
		return this.items && this.items.length > 0;
	};
	this.getItems = function() {
		return this.items;
	};
	this.getItem = function(value) {
		var i, l = this.items.length;
		for (i = 0; i < l;i++) {
			if (this.items[i].value === value) return this.items[i];
		}
		return false;
	};
	this.setLoading = function(flag) {
		this.setDisabled(flag);
		if (flag) this.show();
		LoadingMask.set(el, flag);
		return this;
	};
	
	this.setOptions(options);
}