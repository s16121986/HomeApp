/*!
* round-slider v{VERSION}
*
* @website http://roundsliderui.com/
* @copyright (c) 2015-{YEAR} Soundar
* @license MIT
*/

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {
    "use strict";
    /*jslint nomen: true */

    var pluginName = "roundSlider";

    // The plugin initialization
    $.fn[pluginName] = function (options) {
        return CreateRoundSlider.call(this, options, arguments);
    };

    RoundSlider.prototype = {

        pluginName: pluginName,
        version: "{VERSION}",

        // after the control initialization the updated default values
        // are merged into the options
        options: {},

        // holds the current roundSlider element
        control: null,

        // default properties of the plugin. while add a new property,
        // that type should be included in the "_props:" for validation
        defaults: {
            min: 0,
            max: 100,
            step: 1,
            value: null,
            radius: 85,
            width: 18,
            handleSize: "+0",
            startAngle: 0,
            endAngle: "+360",
            animation: true,
            showTooltip: true,
            editableTooltip: true,
            readOnly: false,
            disabled: false,
            keyboardAction: true,
            mouseScrollAction: false,
            lineCap: "butt",
            sliderType: "min-range",
            circleShape: "full",
            handleShape: "round",
            // the 'startValue' property decides at which point the slider should start.
            // otherwise, by default the slider starts with min value. this is mainly used
            // for min-range slider, where you can customize the min-range start position.
            startValue: null,

            // SVG related properties
            svgMode: true,
            borderWidth: 0,
            borderVisibility: "none",
            borderColor: "",
            pathColor: "",
            rangeColor: "",
            handleColor: null,
            tooltipColor: null,

            // events
            beforeCreate: null,
            create: null,
            start: null,
            beforeValueChange: null,
            drag: null,
            change: null,
            update: null,
            valueChange: null,
            stop: null,
            tooltipFormat: null
        },
        keys: {     // key codes for
            UP: 38,     // up arrow
            DOWN: 40,   // down arrow
            LEFT: 37,   // left arrow
            RIGHT: 39   // right arrow
        },
        _props: function () {
            return {
                numberType: ["min", "max", "step", "radius", "width", "borderWidth", "startAngle", "startValue"],
                booleanType: ["animation", "showTooltip", "editableTooltip", "readOnly", "disabled",
                    "keyboardAction", "mouseScrollAction", "svgMode"],
                stringType: ["sliderType", "circleShape", "handleShape", "lineCap", "borderVisibility"]
            };
        },

        _init: function () {
            var options = this.options;
            if (options.svgMode) {
                var EMPTY_FUNCTION = function () {};
                this._appendSeperator = EMPTY_FUNCTION;
                this._refreshSeperator = EMPTY_FUNCTION;
                this._updateSeperator = EMPTY_FUNCTION;
                this._appendOverlay = EMPTY_FUNCTION;
                this._checkOverlay = EMPTY_FUNCTION;
                this._updateWidth = EMPTY_FUNCTION;
            }

            if (this.control.is("input")) {
                this._isInputType = true;
                this._hiddenField = this.control;
                this.control = this._createElement("div");
                this.control.insertAfter(this._hiddenField);
                options.value = this._hiddenField.val() || options.value;
            }

            if (this._isBrowserSupported()) {
                this._onInit();
            }
        },
        _onInit: function () {
            this._initialize();
            this._update();
            this._render();
        },
        _initialize: function () {
            var browserName = this.browserName = this._getBrowserName();
            if (browserName) this.control.addClass("rs-" + browserName);
            this._isReadOnly = false;
            this._checkDataType();
            this._refreshCircleShape();
        },
        _render: function () {
            this.container = this._createElement("div.rs-container");
            this.innerContainer = this._createElement("div.rs-inner-container");
            this.container.append(this.innerContainer);
            var $rootCSS = "rs-control " + (this.options.svgMode ? "rs-svg-mode" : "rs-classic-mode");
            this.control.addClass($rootCSS).empty().append(this.container);

            this._createLayers();
            this._createOtherLayers();
            this._setContainerClass();
            this._setRadius();
            this._setProperties();
            this._setValue();
            this._updateTooltipPos();
            this._bindControlEvents("_bind");

            this._raiseValueChange("create");
            this._updatePre();
        },
        _update: function () {
            this._validateSliderType();
            this._updateStartEnd();
            this._validateStartEnd();
            this._handle1 = this._handle2 = this._handleDefaults();
            this._analyzeModelValue();
            this._validateModelValue();
        },
        _createLayers: function () {
            var options = this.options;
            if(options.svgMode) {
                this._createSVGElements();
                this._setSVGAttributes();
                this._setSVGStyles();
                this._moveSliderRange(true);
                return;
            }

            this.block = this._createElement("div.rs-block rs-outer rs-border");
            this.innerContainer.append(this.block);

            var padd = options.width, start = this._start, path;
            path = this._createElement("div.rs-path rs-transition");

            if (this._showRange) {
                this.block1 = path.clone().addClass("rs-range-color").rsRotate(start);
                this.block2 = path.clone().addClass("rs-range-color").css("opacity", "0").rsRotate(start);
                this.block3 = path.clone().addClass("rs-path-color").rsRotate(start);
                this.block4 = path.addClass("rs-path-color").css({ "opacity": "1", "z-index": "1" }).rsRotate(start - 180);

                this.block.append(this.block1, this.block2, this.block3, this.block4).addClass("rs-split");
            }
            else this.block.append(path.addClass("rs-path-color"));

            this.lastBlock = this._createElement("span.rs-block").css({ "padding": padd });
            this.innerBlock = this._createElement("div.rs-inner rs-bg-color rs-border");
            this.lastBlock.append(this.innerBlock);
            this.block.append(this.lastBlock);
        },
        _createOtherLayers: function () {
            this._appendHandle();
            this._appendSeperator();    // non SVG mode only
            this._appendOverlay();      // non SVG mode only
            this._appendHiddenField();
        },
        _setProperties: function () {
            var options = this.options;
            this._setHandleShape();
            this._addAnimation();
            this._appendTooltip();
            if (!options.showTooltip) this._removeTooltip();
            if (options.disabled) this.disable();
            else if (options.readOnly) this._readOnly(true);
            if (options.mouseScrollAction) this._bindScrollEvents("_bind");
        },
        _updatePre: function () {
            this._prechange = this._predrag = this._pre_bvc = this._preValue = this.options.value;
        },
        _backupPreValue: function () {
            this._pre_handle1 = this._handle1;
            this._pre_handle2 = this._handle2;
        },
        _revertPreValue: function () {
            this._handle1 = this._pre_handle1;
            this._handle2 = this._pre_handle2;
            this._updateModelValue();
        },
        _setValue: function () {
            if (this._rangeSlider) {
                this._setHandleValue(1);
                this._setHandleValue(2);
            }
            else {
                if (this._minRange && !this.options.svgMode) this._setHandleValue(1);
                var index = this._minRange ? 2 : (this._active || 1);
                this._setHandleValue(index);
            }
        },
        _appendTooltip: function () {
            if (this.container.children(".rs-tooltip").length !== 0) return;
            var tooltip = this.tooltip = this._createElement("span.rs-tooltip rs-tooltip-text");
            this.container.append(tooltip);
            this._setTooltipColor(tooltip);
            this._tooltipEditable();
            this._updateTooltip();
        },
        _removeTooltip: function () {
            if (this.container.children(".rs-tooltip").length == 0) return;
            this.tooltip && this.tooltip.remove();
        },
        _setTooltipColor: function (ele) {
            var o = this.options, tooltipColor = o.tooltipColor;
            var color = tooltipColor !== "inherit" ? tooltipColor : o.rangeColor;
            if (ele && color != null) ele.css("color", color);
        },
        _tooltipEditable: function () {
            var o = this.options, tooltip = this.tooltip, hook;
            if (!tooltip || !o.showTooltip) return;

            if (o.editableTooltip) {
                tooltip.addClass("rs-editable");
                hook = "_bind";
            }
            else {
                tooltip.removeClass("rs-editable");
                hook = "_unbind";
            }
            this[hook](tooltip, "click", this._editTooltip);
        },
        _editTooltip: function () {
            var tooltip = this.tooltip;
            if (!tooltip.hasClass("rs-editable") || this._isReadOnly) return;
            var border = parseFloat(tooltip.css("border-left-width")) * 2;
            var input = this.input = this._createElement("input.rs-input rs-tooltip-text").css({
                height: tooltip.outerHeight() - border,
                width: tooltip.outerWidth() - border
            });
            this._setTooltipColor(input);
            tooltip.html(input).removeClass("rs-editable").addClass("rs-hover");

            input.focus().val(this._getTooltipValue(true));

            this._bind(input, "blur change", this._focusOut);
        },
        _focusOut: function (e) {
            if (e.type == "change") {
                var val = this.input.val().replace("-", ",");
                if (val[0] == ",") {
                    val = "-" + val.slice(1).replace("-", ",");
                }
                this.options.value = val;

                if (this._validateValue(true)) {
                    this.input.val(this._getTooltipValue(true));
                    this._raiseEvent("change");
                }
            }
            else {
                delete this.input;
                this.tooltip.addClass("rs-editable").removeClass("rs-hover");
                this._updateTooltip();
            }
        },
        _setHandleShape: function (preShape) {
            var o = this.options, shape = o.handleShape, prefix = "rs-handle-", allHandles = this._handles();

            allHandles
                .removeClass(prefix + preShape)
                .addClass(prefix + shape);

            if (shape == "dot") allHandles.append(this._createElement("div." + prefix + shape + "-inner"));
            else allHandles.empty();

            this._setHandleColor();
        },
        _setHandleColor: function () {
            var o = this.options, handleColor = o.handleColor, shape = o.handleShape, allHandles = this._handles();
            if (handleColor == "inherit") handleColor = o.rangeColor;

            if (shape == "dot") {
                allHandles
                    .css({ "border-color": handleColor, "background": "" })
                    .children().css("background", handleColor);
            }
            else {
                allHandles
                    .css({ "border-color": "", "background": handleColor });
            }
        },
        _setHandleValue: function (index) {
            this._active = index;
            var handle = this["_handle" + index];
            if (!this._minRange) this.bar = this._activeHandleBar();
            this._changeSliderValue(handle.value, handle.angle);
        },
        _addAnimation: function () {
            if (this.options.animation) this.control.addClass("rs-animation");
        },
        _removeAnimation: function () {
            this.control.removeClass("rs-animation");
        },
        _setContainerClass: function () {
            var circleShape = this.options.circleShape;
            if (circleShape == "full" || circleShape == "pie" || circleShape.indexOf("custom") === 0) {
                this.container.addClass("rs-full rs-" + circleShape);
            }
            else {
                this.container.addClass("rs-" + circleShape.split("-").join(" rs-"));
            }
        },
        _setRadius: function () {
            var o = this.options, r = o.radius, d = r * 2, circleShape = o.circleShape;
            var extraSize = 0, actualHeight, actualWidth;
            var height = actualHeight = d, width = actualWidth = d;

            // whenever the radius changes, before update the container size
            // check for the lineCap also, since that will make some additional size
            // also, based on that need to align the handle bars
            var isFullCircle = (circleShape == "full" || circleShape == "pie" || circleShape.indexOf("custom") === 0);
            if (o.svgMode && !isFullCircle) {
                var handleBars = this._handleBars();
                if (o.lineCap != "none") {
                    extraSize = (o.lineCap === "butt") ? (o.borderWidth / 2) : ((o.width / 2) + o.borderWidth);
                    if (circleShape.indexOf("bottom") != -1) {
                        handleBars.css("margin-top", extraSize + 'px');
                    }
                    if (circleShape.indexOf("right") != -1) {
                        handleBars.css("margin-right", -extraSize + 'px');
                    }
                }
                else {
                    // when lineCap none, then remove the styles that was set previously for the other lineCap props
                    $.each(handleBars, function(i, bar) {
                        bar.style.removeProperty("margin-top");
                        bar.style.removeProperty("margin-right");
                    });
                }
            }

            if (circleShape.indexOf("half") === 0) {
                switch (circleShape) {
                    case "half-top":
                    case "half-bottom":
                        height = r; actualHeight = r + extraSize;
                        break;
                    case "half-left":
                    case "half-right":
                        width = r; actualWidth = r + extraSize;
                        break;
                }
            }
            else if (circleShape.indexOf("quarter") === 0) {
                height = width = r;
                actualHeight = actualWidth = r + extraSize;
            }

            this.container.css({ "height": height, "width": width });
            this.control.css({ "height": actualHeight, "width": actualWidth });

            // when needed, then only we can set the styles through script, otherwise CSS styles applicable
            if (extraSize !== 0) this.innerContainer.css({ "height": actualHeight, "width": actualWidth });
            else this.innerContainer.removeAttr("style");

            if (o.svgMode) {
                this.svgContainer.height(d).width(d)
                    .children("svg").height(d).width(d);
            }
        },
        _border: function (seperator) {
            var options = this.options;
            if (options.svgMode) return options.borderWidth * 2;
            if (seperator) return parseFloat(this._startLine.children().css("border-bottom-width"));
            return parseFloat(this.block.css("border-top-width")) * 2;
        },
        _appendHandle: function () {
            // if this is range or default slider then create handle 1
            if (this._rangeSlider || !this._minRange) this._createHandle(1);
            // if this is range or min-range slider then create handle 2
            if (this._showRange) this._createHandle(2);
        },
        _appendSeperator: function () {
            this._startLine = this._addSeperator(this._start, "rs-start");
            this._endLine = this._addSeperator(this._start + this._end, "rs-end");
            this._refreshSeperator();
        },
        _addSeperator: function (pos, cls) {
            var line = this._createElement("span.rs-seperator rs-border");
            var lineWrap = this._createElement("span.rs-bar rs-transition " + cls).append(line).rsRotate(pos);
            this.container.append(lineWrap);
            return lineWrap;
        },
        _refreshSeperator: function () {
            var bars = this._startLine.add(this._endLine), seperators = bars.children().removeAttr("style");
            var o = this.options, width = o.width, _border = this._border(), size = width + _border;
            if (o.lineCap == "round" && o.circleShape != "full") {
                bars.addClass("rs-rounded");
                seperators.css({ width: size, height: (size / 2) + 1 });
                this._startLine.children().css("margin-top", -1).addClass(this._minRange ? "rs-range-color" : "rs-path-color");
                this._endLine.children().css("margin-top", size / -2).addClass("rs-path-color");
            }
            else {
                bars.removeClass("rs-rounded");
                seperators.css({ "width": size, "margin-top": this._border(true) / -2 }).removeClass("rs-range-color rs-path-color");
            }
        },
        _updateSeperator: function () {
            this._startLine.rsRotate(this._start);
            this._endLine.rsRotate(this._start + this._end);
        },
        _createHandle: function (index) {
            var handle = this._createElement("div.rs-handle");
            handle.attr({ "index": index, "tabindex": "0" });

            var id = this._dataElement()[0].id; id = id ? id + "_" : "";
            var label = id + "handle";
            if (this._rangeSlider) label += "_" + (index == 1 ? "start" : "end");
            handle.attr({ "role": "slider", "aria-label": label });     // WAI-ARIA support

            var handleDefaults = this._handleDefaults();
            var bar = this._createElement("div.rs-bar rs-transition").css("z-index", "7").append(handle);
            bar.addClass(this._rangeSlider && index == 2 ? "rs-second" : "rs-first");
            // at initial creation keep the handle and bar at the default angle position
            bar.rsRotate(handleDefaults.angle);
            this.container.append(bar);
            this._refreshHandle();

            this.bar = bar;
            this._active = index;
            if (index != 1 && index != 2) this["_handle" + index] = handleDefaults;
            this._bind(handle, "focus blur", this._handleFocus);
            return handle;
        },
        _refreshHandle: function () {
            var o = this.options, hSize = o.handleSize, width = o.width, h, w, isSquare = true, _isNumber = this._isNumber;
            if (typeof hSize === "string" && _isNumber(hSize)) {
                if (hSize.charAt(0) === "+" || hSize.charAt(0) === "-") {
                    hSize = width + parseFloat(hSize);
                }
                else if (hSize.indexOf(",")) {
                    var s = hSize.split(",");
                    if (_isNumber(s[0]) && _isNumber(s[1])) w = parseFloat(s[0]), h = parseFloat(s[1]), isSquare = false;
                }
            }
            if (isSquare) h = w = _isNumber(hSize) ? parseFloat(hSize) : width;
            var diff = (width + this._border() - w) / 2;
            this._handles().css({ height: h, width: w, "margin": -h / 2 + "px 0 0 " + diff + "px" });
        },
        _defaultValue: function () {
            var o = this.options, startValue = o.startValue;
            var defaultValue = this._isNumber(startValue) ? this._limitValue(startValue) : o.min;
            return defaultValue;
        },
        _handleDefaults: function () {
            var defaultValue = this._defaultValue();
            return { angle: this._valueToAngle(defaultValue), value: defaultValue };
        },
        _handleBars: function () {
            return this.container.children("div.rs-bar");
        },
        _handles: function () {
            return this._handleBars().find(".rs-handle");
        },
        _activeHandleBar: function (index) {
            if (this._minRange) return this.bar;
            index = (index != undefined) ? index : this._active;
            return $(this._handleBars()[index - 1]);
        },
        _updateHandleBar: function ($handle) {
            this.bar = $handle.parent();
            this._active = parseFloat($handle.attr("index"));
        },
        _getHandleEle: function ($target) {
            if ($target.hasClass("rs-handle"))
                return $target;

            // this is for the "dot" handleShape, where the handle having the child element also
            var $parent = $target.parent();
            if ($parent.hasClass("rs-handle"))
                return $parent;
            return null;
        },
        _handleArgs: function (index) {
            index = (index != undefined) ? index : this._active;
            var _handle = this["_handle" + index] || {};
            return {
                element: this._activeHandleBar(index).children(),
                index: index,
                isActive: index == this._active,
                value: _handle.value,
                angle: _handle.angle
            };
        },
        _dataElement: function () {
            return this._isInputType ? this._hiddenField : this.control;
        },
        _raiseEvent: function (event) {
            var preValue = this["_pre" + event], currentValue = this.options.value;
            if (preValue !== currentValue) {
                this["_pre" + event] = currentValue;
                if (event == "change") {
                    this._predrag = currentValue;
                    this._updateHidden();
                }
                this._updateTooltip();

                var _handle = this._handleArgs();
                this._raise(event, { preValue: preValue, "handle": _handle });

                if (currentValue != this._preValue) {
                    // whenever the drag and change event happens, at that time trigger 'update' also
                    this._raise("update", { preValue: preValue, "handle": _handle, action: event });

                    // after the "update" event trigger the "valueChange" event
                    this._raiseValueChange(event);
                }
            }
        },
        _raiseBeforeValueChange: function (action, value) {
            if (typeof value !== "undefined") {
                if (this._rangeSlider) value = this._formRangeValue(value);
            } else {
                value = this.options.value;
            }
            var isUserAction = (action !== "code");

            if (value !== this._pre_bvc) {
                var args = {
                    value: value,
                    preValue: this._pre_bvc,
                    action: action,
                    isUserAction: isUserAction,
                    cancelable: true
                };

                var returnValue = (this._raise("beforeValueChange", args) != false);
                if (returnValue) {
                    // if the beforeValueChange is success then only we can update the preVal flag
                    // otherwise when user prevent the event, at that time we can't revert this value
                    this._pre_bvc = value;
                }
                return returnValue;
            }
            // if this is the from user action then return false, because user can't update the same value again
            // otherwise if this is from 'code' then return true, since when changing the min and max values
            // at that time also slider needs to update, even though value not changed
            return isUserAction ? false : true;
        },
        _raiseValueChange: function (action) {
            var value = this.options.value, handles = [];
            if (!this._minRange) handles.push(this._handleArgs(1)); // for range and default slider
            if (this._showRange) handles.push(this._handleArgs(2)); // for range and min-range slider

            var args = {
                value: value,
                preValue: this._preValue,
                action: action,
                isUserAction: (action !== "code" && action !== "create"),
                isInvertedRange: this._isInvertedRange,
                handles: handles
            };
            this._raise("valueChange", args);

            // once the valueChange event raised then update all the preVal flags
            this._preValue = value;
        },

        // Events handlers
        _elementDown: function (e) {
            if (this._isReadOnly) return;
            var $handleEle = this._getHandleEle($(e.target));

            if ($handleEle) {
                e.preventDefault();
                this._handleDown($handleEle);
            }
            else {
                var point = this._getXY(e), center = this._getCenterPoint();
                var distance = this._getDistance(point, center);
                var block = this.block || this.svgContainer;
                var outerDistance = block.outerWidth() / 2;
                var innerDistance = outerDistance - (this.options.width + this._border());

                if (distance >= innerDistance && distance <= outerDistance) {
                    var handle = this.control.find(".rs-handle.rs-focus"), angle, value;
                    if (handle.length !== 0) {
                        // here, some handle was in already focused state, and user clicked on the slider path
                        // so this will make the handle unfocus, to avoid that we can prevent this event
                        e.preventDefault();
                    }

                    var d = this._getAngleValue(point, center);
                    angle = d.angle, value = d.value;

                    if (this._rangeSlider) {
                        if (handle.length == 1) {
                            var active = parseFloat(handle.attr("index"));
                            if (!this._invertRange) {
                                if (active == 1 && angle > this._handle2.angle) active = 2;
                                else if (active == 2 && angle < this._handle1.angle) active = 1;
                            }
                            this._active = active;
                        }
                        else this._active = (this._handle2.angle - angle) < (angle - this._handle1.angle) ? 2 : 1;
                        this.bar = this._activeHandleBar();
                    }

                    if (this._raiseBeforeValueChange("change", value)) {
                        this._changeSliderValue(value, angle);
                        this._raiseEvent("change");
                    }
                }
            }
        },
        _handleDown: function ($handle) {
            $handle.focus();
            this._removeAnimation();
            this._bindMouseEvents("_bind");
            this._updateHandleBar($handle);
            this.control.addClass("rs-dragging");
            this._raise("start", { "handle": this._handleArgs() });
        },
        _handleMove: function (e) {
            e.preventDefault();
            var point = this._getXY(e), center = this._getCenterPoint();
            var d = this._getAngleValue(point, center, true), angle, value;
            angle = d.angle, value = d.value;

            if (this._raiseBeforeValueChange("drag", value)) {
                this._changeSliderValue(value, angle);
                this._raiseEvent("drag");
            }
        },
        _handleUp: function () {
            this.control.removeClass("rs-dragging");
            this._bindMouseEvents("_unbind");
            this._addAnimation();
            this._raiseEvent("change");
            this._raise("stop", { "handle": this._handleArgs() });
        },
        _handleFocus: function (e) {
            if (this._isReadOnly) return;
            // the below checks are common for both focus and blur events
            this._handles().removeClass("rs-focus");
            var keyboardActionEnabled = this.options.keyboardAction;
            if (keyboardActionEnabled) {
                this._bindKeyboardEvents("_unbind");
            }

            if (e.type === "blur") {
                return;
            }

            // when the handle gets focus
            var $handle = $(e.target);
            $handle.addClass("rs-focus");
            this._updateHandleBar($handle);
            if (keyboardActionEnabled) {
                this._bindKeyboardEvents("_bind");
            }

            // updates the class for change z-index
            this.control.find("div.rs-bar").css("z-index", "7");
            this.bar.css("z-index", "8");
        },
        _handleKeyDown: function (e) {
            var key = e.keyCode, keyCodes = this.keys;

            if (key == 27)                                      // if Esc key pressed then hanldes will be focused out
                this._handles().blur();

            if (!(key >= 35 && key <= 40)) return;              // if not valid keys, then return
            if (key >= 37 && key <= 40) this._removeAnimation();

            var h = this["_handle" + this._active], val, ang;

            e.preventDefault();
            if (key == keyCodes.UP || key == keyCodes.RIGHT)                                // Up || Right Key
                val = this._round(this._limitValue(h.value + this.options.step));
            else if (key == keyCodes.DOWN || key == keyCodes.LEFT)                          // Down || Left Key
                val = this._round(this._limitValue(h.value - this._getMinusStep(h.value)));
            else if (key == 36)                                                             // Home Key
                val = this._getKeyValue("Home");
            else if (key == 35)                                                             // End Key
                val = this._getKeyValue("End");

            ang = this._valueToAngle(val);

            if (this._raiseBeforeValueChange("drag", val)) {
                this._changeSliderValue(val, ang);
                this._raiseEvent("drag");
            }
        },
        _handleKeyUp: function () {
            this._addAnimation();
            this._raiseEvent("change");
        },
        _getMinusStep: function (val) {
            var o = this.options, min = o.min, max = o.max, step = o.step;
            if (val == max) {
                var remain = (max - min) % step;
                return remain == 0 ? step : remain;
            }
            return step;
        },
        _getKeyValue: function (key) {
            var o = this.options, min = o.min, max = o.max;
            if (this._rangeSlider) {
                if (key == "Home") return (this._active == 1) ? min : this._handle1.value;
                else return (this._active == 1) ? this._handle2.value : max;
            }
            return (key == "Home") ? min : max;
        },
        _elementScroll: function (event) {
            if (this._isReadOnly) return;
            event.preventDefault();
            var e = event.originalEvent || event, h, val, ang, delta;
            delta = e.wheelDelta ? e.wheelDelta / 60 : (e.detail ? -e.detail / 2 : 0);
            if (delta == 0) return;

            this._updateActiveHandle(event);
            h = this["_handle" + this._active];
            val = h.value + (delta > 0 ? this.options.step : -this._getMinusStep(h.value));
            val = this._limitValue(val);
            ang = this._valueToAngle(val);

            if (this._raiseBeforeValueChange("change", val)) {
                this._removeAnimation();
                this._changeSliderValue(val, ang);
                this._raiseEvent("change");
                this._addAnimation();
            }
        },
        _updateActiveHandle: function (e) {
            var $target = $(e.target);
            var $handleEle = this._getHandleEle($target);

            if ($handleEle && $target.parents(".rs-control")[0] == this.control[0]) {
                this._updateHandleBar($handleEle);
            }
            // get the updated handle again and focus that
            var $handle = this.bar.children();
            if (!$handle.hasClass("rs-focus")) $handle.focus();
        },

        // Events binding
        _bindControlEvents: function (hook) {
            this[hook](this.control, "mousedown touchstart", this._elementDown);
        },
        _bindScrollEvents: function (hook) {
            this[hook](this.control, "mousewheel DOMMouseScroll", this._elementScroll);
        },
        _bindMouseEvents: function (hook) {
            var _document = $(document);
            this[hook](_document, "mousemove touchmove", this._handleMove);
            this[hook](_document, "mouseup mouseleave touchend touchcancel", this._handleUp);
        },
        _bindKeyboardEvents: function (hook) {
            var _document = $(document);
            this[hook](_document, "keydown", this._handleKeyDown);
            this[hook](_document, "keyup", this._handleKeyUp);
        },

        // internal methods
        _changeSliderValue: function (value, angle) {
            var oAngle = this._oriAngle(angle), lAngle = this._limitAngle(angle),
                activeHandle = this._active,
                options = this.options;

            if (!this._showRange) {
                // if this is the default slider
                this["_handle" + activeHandle] = { angle: angle, value: value };
                options.value = value;
                this.bar.rsRotate(lAngle);
                this._updateARIA(value);
            }
            else {
                var isValidRange = (activeHandle == 1 && oAngle <= this._oriAngle(this._handle2.angle)) ||
                    (activeHandle == 2 && oAngle >= this._oriAngle(this._handle1.angle));
                var canAllowInvertRange = this._invertRange;

                if (this._minRange || isValidRange || canAllowInvertRange) {
                    this["_handle" + activeHandle] = { angle: angle, value: value };
                    options.value = this._rangeSlider ? this._handle1.value + "," + this._handle2.value : value;
                    this.bar.rsRotate(lAngle);
                    this._updateARIA(value);

                    if (options.svgMode) {
                        this._moveSliderRange();
                        return;
                    }

                    // classic DIV handling
                    var dAngle = this._oriAngle(this._handle2.angle) - this._oriAngle(this._handle1.angle), o2 = "1", o3 = "0";
                    if (dAngle <= 180 && !(dAngle < 0 && dAngle > -180)) o2 = "0", o3 = "1";
                    this.block2.css("opacity", o2);
                    this.block3.css("opacity", o3);

                    (activeHandle == 1 ? this.block4 : this.block2).rsRotate(lAngle - 180);
                    (activeHandle == 1 ? this.block1 : this.block3).rsRotate(lAngle);
                }
            }
        },

        // SVG related functionalities
        _createSVGElements: function () {
            var svgEle = this.$svgEle = this._createSVG("svg");
            var PATH = "path.rs-transition ";

            this.$pathEle = this._createSVG(PATH + "rs-path");
            this.$rangeEle = this._showRange ? this._createSVG(PATH + "rs-range") : null;
            this.$borderEle = this._createSVG(PATH + "rs-border");
            this._append(svgEle, [this.$pathEle, this.$rangeEle, this.$borderEle]);

            this.svgContainer = this._createElement("div.rs-svg-container")
                .append(svgEle)
                .appendTo(this.innerContainer);
        },
        _setSVGAttributes: function () {
            var o = this.options, radius = o.radius,
                border = o.borderWidth, width = o.width,
                lineCap = o.lineCap, borderStyle = o.borderVisibility;
            var outerRadius = radius - (border / 2),
                innerRadius = outerRadius - width - border;
            this.centerRadius = radius - border - (width / 2);

            var startAngle = this._start,
                endAngle = startAngle + this._end;

            this.svgPathLength = this._getArcLength(this.centerRadius);

            if (borderStyle === "outer") innerRadius = outerRadius;
            else if (borderStyle === "inner") outerRadius = innerRadius;

            // draw the path for border element
            var border_d = this._drawPath(startAngle, endAngle, outerRadius, innerRadius);
            this._setAttribute(this.$borderEle, {
                "d": border_d
            });
            // and set the border width in css styles, since it shouldn't be overwritten by other styles
            $(this.$borderEle).css("stroke-width", border);

            var d = this._drawPath(startAngle, endAngle, this.centerRadius);
            var attr = { "d": d, "stroke-width": width, "stroke-linecap": lineCap };

            // draw the path for slider path element
            this._setAttribute(this.$pathEle, attr);

            if (this._showRange) {
                // draw the path for slider range element
                this._setAttribute(this.$rangeEle, attr);

                // there was a small bug when lineCap was round/square, this will solve that
                if (lineCap == "round" || lineCap == "square") this.$rangeEle.setAttribute("stroke-dashoffset", "0.01");
                else this.$rangeEle.removeAttribute("stroke-dashoffset");
            }
        },
        _getArcLength: function (radius) {
            // circle's arc length formula => 2πR(Θ/360)
            return 2 * Math.PI * radius * (this._end / 360);
        },
        _setSVGStyles: function () {
            var o = this.options,
                borderColor = o.borderColor || "",
                pathColor = o.pathColor || "",
                rangeColor = o.rangeColor || "";

            if (borderColor == "inherit") borderColor = rangeColor;
            $(this.$borderEle).css("stroke", borderColor);

            this.svgContainer[(pathColor == "inherit") ? "addClass" : "removeClass"]("rs-path-inherited");
            if (pathColor == "inherit") pathColor = rangeColor;
            $(this.$pathEle).css("stroke", pathColor);

            if (this._showRange) {
                $(this.$rangeEle).css("stroke", rangeColor);
            }

            this._setHandleColor();
        },
        _moveSliderRange: function (isInit) {
            if (!this._showRange) return;

            var startAngle = this._start,
                totalAngle = this._end;
            var handle1Angle = this._handle1.angle,
                handle2Angle = this._handle2.angle;
            if (isInit) {
                // at the initial time, keep all the handles angle to default angle
                // so that once the value set, the animation happens from this default angle
                handle1Angle = handle2Angle = this._handleDefaults().angle;
            }

            // always to get the actual angle, just minus from the start angle
            handle1Angle -= startAngle;
            handle2Angle -= startAngle;

            var dashArray = [];
            var isNormalRange = (handle1Angle <= handle2Angle);
            this._isInvertedRange = !isNormalRange;

            if (isNormalRange) {
                // starting the dashArray from 0 means normal range, otherwise it's invert range
                // so when handle1 value is smaller then it's a normal range selection only
                dashArray.push(0);
            }
            else {
                if (this._minRange) {
                    // this case will be executed for the min-range slider with any startValue set.
                    // when the handle value goes beyond the startValue, then this will be triggered.
                    // which means that is a invert range selection, but for min-range slider the invert range
                    // is not applicable, so by default show the normal range instead of the inverted range.
                    dashArray.push(0);
                }
                // when handle1 value is larger then it's a invert range selection, also swap the values
                var temp = handle1Angle;
                handle1Angle = handle2Angle;
                handle2Angle = temp;
            }

            var handle1Distance = (handle1Angle / totalAngle) * this.svgPathLength;
            dashArray.push(handle1Distance);

            var handle2Distance = ((handle2Angle - handle1Angle) / totalAngle) * this.svgPathLength;
            dashArray.push(handle2Distance, this.svgPathLength);

            this.$rangeEle.style.strokeDasharray = dashArray.join(" ");
        },
        _isPropsRelatedToSVG: function (property) {
            var svgRelatedProps = ["radius", "borderWidth", "borderVisibility", "width", "lineCap", "startAngle", "endAngle"];
            return this._hasProperty(property, svgRelatedProps);
        },
        _isPropsRelatedToSVGStyles: function (property) {
            var svgStylesRelatedProps = ["borderColor", "pathColor", "rangeColor", "handleColor"];
            return this._hasProperty(property, svgStylesRelatedProps);
        },
        _hasProperty: function (property, list) {
            if (typeof property == "string") {
                return (list.indexOf(property) !== -1);
            }
            else {
                var allProperties = Object.keys(property);
                return allProperties.some(function(prop) {
                    return (list.indexOf(prop) !== -1);
                });
            }
        },

        // WAI-ARIA support
        _updateARIA: function (value) {
            var o = this.options, min = o.min, max = o.max;
            this.bar.children().attr({ "aria-valuenow": value });
            if (this._rangeSlider) {
                var handles = this._handles();
                handles.eq(0).attr({ "aria-valuemin": min });
                handles.eq(1).attr({ "aria-valuemax": max });

                if (this._active == 1) handles.eq(1).attr({ "aria-valuemin": value });
                else handles.eq(0).attr({ "aria-valuemax": value });
            }
            else this.bar.children().attr({ "aria-valuemin": min, "aria-valuemax": max });
        },
        _getDistance: function (p1, p2) {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        },
        _getXY: function (e) {
            if (e.type.indexOf("mouse") == -1) e = (e.originalEvent || e).changedTouches[0];
            return { x: e.pageX, y: e.pageY };
        },
        _getCenterPoint: function () {
            var block = this.block || this.svgContainer;
            var offset = block.offset(), center;
            center = {
                x: offset.left + (block.outerWidth() / 2),
                y: offset.top + (block.outerHeight() / 2)
            };
            return center;
        },
        _getAngleValue: function (point, center, isDrag) {
            var deg = Math.atan2(point.y - center.y, center.x - point.x);
            var angle = (-deg / (Math.PI / 180));
            if (angle < this._start) angle += 360;
            angle = this._checkAngle(angle, isDrag);
            return this._processStepByAngle(angle);
        },
        _checkAngle: function (angle, isDrag) {
            var o_angle = this._oriAngle(angle),
                preAngle = this["_handle" + this._active].angle,
                o_preAngle = this._oriAngle(preAngle);

            if (o_angle > this._end) {
                if (!isDrag) return preAngle;
                angle = this._start + (o_preAngle <= this._end - o_preAngle ? 0 : this._end);
            }
            else if (isDrag) {
                var d = this._handleDragDistance;
                if (this._isNumber(d)) if (Math.abs(o_angle - o_preAngle) > d) return preAngle;
            }
            return angle;
        },
        _processStepByAngle: function (angle) {
            var value = this._angleToValue(angle);
            return this._processStepByValue(value);
        },
        _processStepByValue: function (value) {
            var o = this.options, min = o.min, max = o.max, step = o.step, isMinHigher = (min > max);
            var remain, currVal, nextVal, preVal, newVal, ang;

            step = (isMinHigher ? -step : step);
            remain = (value - min) % step;

            currVal = value - remain;
            nextVal = this._limitValue(currVal + step);
            preVal = this._limitValue(currVal - step);

            if(!isMinHigher) {
                if (value >= currVal) newVal = (value - currVal < nextVal - value) ? currVal : nextVal;
                else newVal = (currVal - value > value - preVal) ? currVal : preVal;
            }
            else {
                if (value <= currVal) newVal = (currVal - value < value - nextVal) ? currVal : nextVal;
                else newVal = (value - currVal > preVal - value) ? currVal : preVal;
            }
            newVal = this._round(newVal), ang = this._valueToAngle(newVal);
            return { value: newVal, angle: ang };
        },
        _round: function (val) {
            var s = this.options.step.toString().split(".");
            return s[1] ? parseFloat(val.toFixed(s[1].length)) : Math.round(val);
        },
        _oriAngle: function (angle) {
            var ang = angle - this._start;
            if (ang < 0) ang += 360;
            return ang;
        },
        _limitAngle: function (angle) {
            if (angle > 360 + this._start) angle -= 360;
            if (angle < this._start) angle += 360;
            return angle;
        },
        _limitValue: function (value) {
            var o = this.options, min = o.min, max = o.max, isMinHigher = (min > max);
            if ((!isMinHigher && value < min) || (isMinHigher && value > min)) value = min;
            if ((!isMinHigher && value > max) || (isMinHigher && value < max)) value = max;
            return value;
        },
        _angleToValue: function (angle) {
            var o = this.options, min = o.min, max = o.max, value;
            value = (this._oriAngle(angle) / this._end) * (max - min) + min;
            return value;
        },
        _valueToAngle: function (value) {
            var o = this.options, min = o.min, max = o.max, angle;
            angle = (((value - min) / (max - min)) * this._end) + this._start;
            return angle;
        },
        _appendHiddenField: function () {
            var hiddenField = this._hiddenField = this._hiddenField || this._createElement("input");
            hiddenField.attr({
                "type": "hidden", "name": this._dataElement()[0].id || ""
            });
            this.control.append(hiddenField);
            this._updateHidden();
        },
        _updateHidden: function () {
            var val = this.options.value;
            this._hiddenField.val(val);
        },
        _updateTooltip: function () {
            var o = this.options, tooltip = this.tooltip;
            if (tooltip){
                if (!tooltip.hasClass("rs-hover"))
                    tooltip.html(this._getTooltipValue());
                this._updateTooltipPos();
            }

            if (!o.showTooltip && o.mouseScrollAction) {
                // fix for a weird issue !! with min-range slider, tooltip disabled and mouseScrollAction enabled
                // when you mouse scroll on slider, the range very strucks. so we need to touch the DOM for this case.
                this.control.height();
            }
        },
        _updateTooltipPos: function () {
            var o = this.options, circleShape = o.circleShape, pos = {};
            if (!o.showTooltip || circleShape.indexOf("quarter") === 0) return;
            var tooltip = this.tooltip;

            if(!tooltip.is(":visible")) {
                // when the element is not in the visible state we can't find height and width
                // for this case we can set the translate to center the element
                // To-Do: maybe in future, based on multiple use cases we can make this way as default
                tooltip.addClass("rs-center");
            }
            else {
                tooltip.removeClass("rs-center").addClass("rs-reset");
                var marginTop = -(tooltip.outerHeight() / 2),   // before get the tooltip height and width, we can reset
                    marginLeft = -(tooltip.outerWidth() / 2);   // the previous styles so that we can get the proper values.
                tooltip.removeClass("rs-reset");

                if (circleShape == "full" || circleShape == "pie" || circleShape.indexOf("custom") === 0) {
                    pos = { "margin-top": marginTop, "margin-left": marginLeft };
                }
                else if (circleShape == "half-top" || circleShape == "half-bottom") {
                    pos = { "margin-left": marginLeft };
                }
                else if (circleShape == "half-left" || circleShape == "half-right") {
                    pos = { "margin-top": marginTop };
                }
            }
            tooltip.css(pos);
        },
        _getTooltipValue: function (isNormal) {
            var value = this.options.value;
            if (this._rangeSlider) {
                var p = value.split(",");
                if (isNormal) return p[0] + " - " + p[1];
                return this._tooltipValue(p[0], 1) + " - " + this._tooltipValue(p[1], 2);
            }
            if (isNormal) return value;
            return this._tooltipValue(value);
        },
        _tooltipValue: function (value, index) {
            var returnValue = this._raise("tooltipFormat", { value: value, "handle": this._handleArgs(index) });
            return (returnValue != null && typeof returnValue !== "boolean") ? returnValue : value;
        },
        _validateStartAngle: function () {
            var options = this.options, start = options.startAngle;
            start = (this._isNumber(start) ? parseFloat(start) : 0) % 360;
            if (start < 0) start += 360;
            options.startAngle = start;
            return start;
        },
        _validateEndAngle: function () {
            var o = this.options, start = o.startAngle, end = o.endAngle;
            if (this._isNumber(end)) {
                if (typeof end === "string" && (end.charAt(0) === "+" || end.charAt(0) === "-")) {
                    end = start + parseFloat(end);
                }
                end = parseFloat(end);
            }
            else end = start + 360;

            end %= 360;
            if (end <= start) end += 360;
            return end;
        },
        _refreshCircleShape: function () {
            var options = this.options, circleShape = options.circleShape;
            var allCircelShapes = ["half-top", "half-bottom", "half-left", "half-right",
                "quarter-top-left", "quarter-top-right", "quarter-bottom-right", "quarter-bottom-left",
                "pie", "custom-half", "custom-quarter"];

            if (allCircelShapes.indexOf(circleShape) == -1) {
                if (circleShape == "half") circleShape = "half-top";
                else if (circleShape == "quarter") circleShape = "quarter-top-left";
                else circleShape = "full";
            }
            options.circleShape = circleShape;
        },
        _appendOverlay: function () {
            var shape = this.options.circleShape;
            if (shape == "pie")
                this._checkOverlay(".rs-overlay", 270);
            else if (shape == "custom-half" || shape == "custom-quarter") {
                this._checkOverlay(".rs-overlay1", 180);
                if (shape == "custom-quarter")
                    this._checkOverlay(".rs-overlay2", this._end);
            }
        },
        _checkOverlay: function (cls, angle) {
            var overlay = this.container.children(cls);
            if (overlay.length == 0) {
                overlay = this._createElement("div" + cls + " rs-transition rs-bg-color");
                this.container.append(overlay);
            }
            overlay.rsRotate(this._start + angle);
        },
        _checkDataType: function () {
            var m = this.options, i, prop, value, props = this._props();
            // to check number datatype
            for (i in props.numberType) {
                prop = props.numberType[i], value = m[prop];
                if (!this._isNumber(value)) m[prop] = this.defaults[prop];
                else m[prop] = parseFloat(value);
            }
            // to check input string
            for (i in props.booleanType) {
                prop = props.booleanType[i], value = m[prop];
                m[prop] = (value == "false") ? false : !!value;
            }
            // to check boolean datatype
            for (i in props.stringType) {
                prop = props.stringType[i], value = m[prop];
                m[prop] = ("" + value).toLowerCase();
            }
        },
        _validateSliderType: function () {
            var options = this.options, type = options.sliderType.toLowerCase();
            this._rangeSlider = this._showRange = this._minRange = false;
            if (type == "range") this._rangeSlider = this._showRange = true;
            else if (type.indexOf("min") != -1) {
                this._showRange = this._minRange = true;
                type = "min-range";
            }
            else type = "default";
            options.sliderType = type;
        },
        _updateStartEnd: function () {
            var o = this.options, circle = o.circleShape, startAngle = o.startAngle, endAngle = o.endAngle;

            if (circle != "full") {
                var QUARTER = "quarter", HALF = "half",
                    TOP = "-top", BOTTOM = "-bottom", LEFT = "-left", RIGHT = "-right";

                if (circle.indexOf(QUARTER) != -1) endAngle = "+90";
                else if (circle.indexOf(HALF) != -1) endAngle = "+180";
                else if (circle == "pie") endAngle = "+270";
                o.endAngle = endAngle;

                if (circle == QUARTER + TOP + LEFT || circle == HALF + TOP) startAngle = 0;
                else if (circle == QUARTER + TOP + RIGHT || circle == HALF + RIGHT) startAngle = 90;
                else if (circle == QUARTER + BOTTOM + RIGHT || circle == HALF + BOTTOM) startAngle = 180;
                else if (circle == QUARTER + BOTTOM + LEFT || circle == HALF + LEFT) startAngle = 270;
                o.startAngle = startAngle;
            }
        },
        _validateStartEnd: function () {
            this._start = this._validateStartAngle();
            this._end = this._validateEndAngle();

            var add = (this._start < this._end) ? 0 : 360;
            this._end += add - this._start;
        },
        _validateValue: function (isChange) {
            this._backupPreValue();
            this._analyzeModelValue();
            this._validateModelValue();

            if (this._raiseBeforeValueChange(isChange ? "change" : "code")) {
                this._setValue();
                this._backupPreValue();
                return true;
            } else {
                this._revertPreValue();
                return false;
            }
        },
        _analyzeModelValue: function () {
            var o = this.options, val = o.value, newValue;
            if (val instanceof Array) val = val.toString();
            var parts = (typeof val == "string") ? val.split(",") : [val];
            if (parts.length == 1 && this._isNumber(parts[0])) parts = [o.min, parts[0]];
            else if (parts.length >= 2 && !this._isNumber(parts[1])) parts[1] = o.max;

            var _this = this, parseModelValue = function (value) {
                return _this._isNumber(value) ? parseFloat(value) : _this._defaultValue();
            };

            if (this._rangeSlider) {
                newValue = [
                    parseModelValue(parts[0]),
                    parseModelValue(parts[1])
                ].toString();
            }
            else {
                var lastValue = parts.pop();
                newValue = parseModelValue(lastValue);
            }
            o.value = newValue;
        },
        _validateModelValue: function () {
            var o = this.options, val = o.value;
            if (this._rangeSlider) {
                var parts = val.split(","), val1 = parseFloat(parts[0]), val2 = parseFloat(parts[1]);
                val1 = this._limitValue(val1);
                val2 = this._limitValue(val2);
                if (!this._invertRange) {
                    var min = o.min, max = o.max;
                    var isMinHigher = (min > max);
                    if (isMinHigher) {
                        if (val1 < val2) val1 = val2;
                    } else {
                        if (val1 > val2) val2 = val1;
                    }
                }

                this._handle1 = this._processStepByValue(val1);
                this._handle2 = this._processStepByValue(val2);
            }
            else {
                var index = this._minRange ? 2 : (this._active || 1);
                this["_handle" + index] = this._processStepByValue(this._limitValue(val));
            }
            this._updateModelValue();
        },
        _updateModelValue: function () {
            var value;
            if (this._rangeSlider) {
                value = this._handle1.value + "," + this._handle2.value;
            }
            else {
                var index = this._minRange ? 2 : (this._active || 1);
                value = this["_handle" + index].value;
            }
            this.options.value = value;
        },
        _formRangeValue: function (value, index) {
            index = index || this._active;
            var h1 = this._handle1.value, h2 = this._handle2.value;
            return (index == 1) ? value + "," + h2 : h1 + "," + value;
        },

        // common core methods
        _createElement: function (tag) {
            var t = tag.split('.');
            return $(document.createElement(t[0])).addClass(t[1] || "");
        },
        _createSVG: function (tag, attr) {
            var t = tag.split('.'), tagName = t[0], className = t[1];
            var svgEle = document.createElementNS("http://www.w3.org/2000/svg", tagName);
            if (className) {
                svgEle.setAttribute("class", t[1]);
            }
            if (tagName == "path") {
                attr = (attr || {});
                attr["fill"] = "transparent";
            }
            if (attr) {
                this._setAttribute(svgEle, attr);
            }
            return svgEle;
        },
        _setAttribute: function (ele, attr) {
            for (var key in attr) {
                var val = attr[key];
                if (key === "class") {
                    var prev = ele.getAttribute('class');
                    if (prev) val += " " + prev;
                }
                ele.setAttribute(key, val);
            }
            return ele;
        },
        _append: function (parent, children) {
            children.forEach(function(element) {
                element && parent.appendChild(element);
            });
            return parent;
        },
        _isNumber: function (number) {
            number = parseFloat(number);
            return typeof number === "number" && !isNaN(number);
        },
        _getBrowserName: function () {
            var browserName = "", ua = window.navigator.userAgent;
            if ((!!window.opr && !!opr.addons) || !!window.opera || ua.indexOf(' OPR/') >= 0) browserName = "opera";
            else if (typeof InstallTrigger !== 'undefined') browserName = "firefox";
            else if (ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0) browserName = "ie";
            else if (window.StyleMedia) browserName = "edge";
            else if (ua.indexOf('Safari') != -1 && ua.indexOf('Chrome') == -1) browserName = "safari";
            else if ((!!window.chrome && !!window.chrome.webstore) || (ua.indexOf('Chrome') != -1)) browserName = "chrome";
            return browserName;
        },
        _isBrowserSupported: function () {
            var properties = ["borderRadius", "WebkitBorderRadius", "MozBorderRadius",
                "OBorderRadius", "msBorderRadius", "KhtmlBorderRadius"];
            for (var i = 0; i < properties.length; i++) {
                if (document.body.style[properties[i]] !== undefined) return true;
            }
            console.error(pluginName + ' : Browser not supported');
        },
        _raise: function (event, args) {
            var o = this.options, fn = o[event], val = true;
            args = args || {};

            // default event arguments
            args["id"] = this.id;
            args["control"] = this.control;
            args["options"] = o;
            args["$this"] = this;
            if (!Object.prototype.hasOwnProperty.call(args, "value")) {
                args["value"] = o.value;
            }

            if (fn) {
                args["type"] = event;
                if (typeof fn === "string") fn = window[fn];
                if ($.isFunction(fn)) {
                    val = fn.call(this, args);
                    val = val === false ? false : val;
                }
            }
            this.control.trigger($.Event(event, args));
            return val;
        },
        _bind: function (element, _event, handler) {
            $(element).on(_event, $.proxy(handler, this));
        },
        _unbind: function (element, _event, handler) {
            $(element).off(_event, $.proxy(handler, this));
        },
        _getInstance: function () {
            return $.data(this._dataElement()[0], pluginName);
        },
        _saveInstanceOnElement: function () {
            $.data(this.control[0], pluginName, this);
        },
        _saveInstanceOnID: function () {
            var id = this.id;
            if (id && typeof window[id] !== "undefined")
                window[id] = this;
        },
        _removeData: function () {
            var control = this._dataElement()[0];
            $.removeData && $.removeData(control, pluginName);
            if (control.id && typeof window[control.id]["_init"] === "function")
                delete window[control.id];
        },
        _destroyControl: function () {
            if (this._isInputType) this._dataElement().insertAfter(this.control).attr("type", "text");
            this.control.empty().removeClass("rs-control").height("").width("");
            this._removeAnimation();
            this._bindControlEvents("_unbind");
            this._bindScrollEvents("_unbind");
        },

        // methods to dynamic options updation (through option)
        _updateWidth: function () {
            this.lastBlock.css("padding", this.options.width);
        },
        _readOnly: function (bool) {
            this._isReadOnly = bool;
            this.container.removeClass("rs-readonly");
            if (bool) this.container.addClass("rs-readonly");
        },

        // dynamic property set
        _setProp: function (property, value, forceSet) {
            var props = this._props();
            if ($.inArray(property, props.numberType) != -1) {          // to check number datatype
                if (!this._isNumber(value)) return;
                value = parseFloat(value);
            }
            else if ($.inArray(property, props.booleanType) != -1) {    // to check boolean datatype
                value = (value == "false") ? false : !!value;
            }
            else if ($.inArray(property, props.stringType) != -1) {     // to check input string
                value = value.toLowerCase();
            }

            var options = this.options;
            this._preValue = options.value;
            var prePropValue = options[property];
            if (!forceSet && prePropValue === value) return;
            options[property] = value;

            switch (property) {
                case "startAngle":
                case "endAngle":
                    this._validateStartEnd();
                    this._updateSeperator();    // non SVG mode only
                    this._appendOverlay();      // non SVG mode only
                case "startValue":
                    if (this._minRange) {
                        this._handle1 = this._handleDefaults();
                    }
                case "min":
                case "max":
                case "step":
                case "value":
                    if (this._validateValue()) {
                        this._updateHidden();
                        this._updateTooltip();
                        if (options.value !== this._preValue) {
                            this._raiseValueChange("code");
                            this._updatePre();
                        }
                    }
                    break;
                case "radius":
                    this._setRadius();
                    this._updateTooltipPos();
                    break;
                case "width":
                    this._removeAnimation();
                    this._updateWidth();        // non SVG mode only
                    this._setRadius();
                    this._refreshHandle();
                    this._updateTooltipPos();
                    this._addAnimation();
                    this._refreshSeperator();   // non SVG mode only
                    break;
                case "borderWidth":
                    this._setRadius();
                    this._refreshHandle();
                    break;
                case "handleSize":
                    this._refreshHandle();
                    break;
                case "handleShape":
                    this._setHandleShape(prePropValue);
                    break;
                case "animation":
                    options.animation ? this._addAnimation() : this._removeAnimation();
                    break;
                case "showTooltip":
                    options.showTooltip ? this._appendTooltip() : this._removeTooltip();
                    break;
                case "editableTooltip":
                    this._tooltipEditable();
                    this._updateTooltipPos();
                    break;
                case "tooltipFormat":
                    this._updateTooltip();
                    break;
                case "rangeColor":
                case "tooltipColor":
                    this._setTooltipColor(this.tooltip);
                    this._setTooltipColor(this.input);
                    break;
                case "disabled":
                    options.disabled ? this.disable() : this.enable();
                    break;
                case "readOnly":
                    options.readOnly ? this._readOnly(true) : (!options.disabled && this._readOnly(false));
                    break;
                case "mouseScrollAction":
                    this._bindScrollEvents(options.mouseScrollAction ? "_bind" : "_unbind");
                    break;
                case "lineCap":
                    this._setRadius();
                    this._refreshSeperator();   // non SVG mode only
                    break;
                case "circleShape":
                    this._refreshCircleShape();
                    if (options.circleShape == "full") {
                        options.startAngle = 0;
                        options.endAngle = "+360";
                    }
                case "sliderType":
                    this._destroyControl();
                    this._onInit();
                    break;
                case "svgMode":
                    var $control = this.control, $options = options;
                    this.destroy();
                    $control[pluginName]($options);
                    break;
            }
            return this;
        },

        // public methods
        option: function (property, value) {
            this.set(property, value);
        },
        get: function (property) {
            return this.options[property];
        },
        set: function (property, value) {
            if (!property || !this._getInstance()) return;

            var options = this.options;
            if ($.isPlainObject(property)) {
                var MIN = "min", MAX = "max", VALUE = "value";
                var isMinAvailable = property[MIN] !== undefined;
                var isMaxAvailable = property[MAX] !== undefined;

                if (isMinAvailable || isMaxAvailable) {
                    if (isMinAvailable) {
                        options[MIN] = property[MIN];
                        delete property[MIN];
                    }
                    if (isMaxAvailable) {
                        options[MAX] = property[MAX];
                        delete property[MAX];
                    }

                    var val = options.value;
                    if (property[VALUE] !== undefined) {
                        val = property[VALUE];
                        delete property[VALUE];
                    }
                    this._setProp(VALUE, val, true);
                }
                for (var prop in property) {
                    this._setProp(prop, property[prop]);
                }
            }
            else if (typeof property == "string") {
                if (value === undefined) return this.get(property);
                this._setProp(property, value);
            }

            // whenever the properties set dynamically, check for SVG mode. also check
            // any of the property was related to SVG. If yes, then redraw the SVG path
            if (options.svgMode) {
                if (this._isPropsRelatedToSVG(property)) {
                    this._setSVGAttributes();
                    this._moveSliderRange();
                }
                if (this._isPropsRelatedToSVGStyles(property)) {
                    this._setSVGStyles();
                }
            }

            return this;
        },
        getValue: function (index) {
            if (this._rangeSlider && this._isNumber(index)) {
                var i = parseFloat(index);
                if (i == 1 || i == 2)
                    return this["_handle" + i].value;
            }
            return this.get("value");
        },
        setValue: function (value, index) {
            if (this._isNumber(value)) {
                if (this._isNumber(index)) {
                    if (this._rangeSlider) {
                        var i = parseFloat(index), val = parseFloat(value);
                        value = this._formRangeValue(val, i);
                    }
                    else if (!this._minRange) this._active = index;
                }
                this._setProp("value", value);
            }
        },
        refreshTooltip: function () {
            this._updateTooltipPos();
        },
        disable: function () {
            this.options.disabled = true;
            this.container.addClass("rs-disabled");
            this._readOnly(true);
        },
        enable: function () {
            var options = this.options;
            options.disabled = false;
            this.container.removeClass("rs-disabled");
            if (!options.readOnly) this._readOnly(false);
        },
        destroy: function () {
            if (!this._getInstance()) return;
            this._destroyControl();
            this._removeData();
            if (this._isInputType) this.control.remove();
        }
    };

    $.fn.rsRotate = function (degree) {
        var control = this, rotation = "rotate(" + degree + "deg)";
        control.css('-webkit-transform', rotation);
        control.css('-moz-transform', rotation);
        control.css('-ms-transform', rotation);
        control.css('-o-transform', rotation);
        control.css('transform', rotation);
        return control;
    };

    // The plugin constructor
    function RoundSlider(control, options) {
        this.id = control.id;
        this.control = $(control);

        // the options value holds the updated defaults value
        this.options = $.extend(
            {}, this.defaults, typeof options === "object" ? options : {}
        );
    }

    // The plugin wrapper, prevents multiple instantiations
    function CreateRoundSlider(options, args) {

        for (var i = 0; i < this.length; i++) {
            var that = this[i], instance = $.data(that, pluginName);
            if (!instance) {
                var _this = new RoundSlider(that, options);
                _this._saveInstanceOnElement();
                _this._saveInstanceOnID();

                if (_this._raise("beforeCreate") !== false) {
                    _this._init();
                    _this._raise("create");
                }
                else _this._removeData();
                instance = _this;
            }
            else if ($.isPlainObject(options)) {
                if (typeof instance.option === "function") instance.set(options);
                else if (that.id && window[that.id] && typeof window[that.id].option === "function") {
                    window[that.id].set(options);
                }
            }
            if (typeof options === "string") {
                if (args[0] === "option") {
                    Array.prototype.shift.call(args);
                }
                var prop = args[0], returnVal;

                if (Object.prototype.hasOwnProperty.call(instance.options, prop)) {
                    var value = args[1];
                    returnVal = instance.set(prop, value);
                    if (value === undefined) return returnVal;
                }
                else if (typeof instance[prop] === "function") {
                    returnVal = instance[prop](args[1], args[2]);
                    if (prop.indexOf("get") === 0) return returnVal;
                }
                else if ($.isPlainObject(prop)) {
                    instance.set(prop);
                }
            }
        }
        return this;
    }

    // ### SVG related logic
    RoundSlider.prototype._polarToCartesian = function (radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 180) * Math.PI / 180;
        var centerXY = this.options.radius;

        return [
            centerXY + (radius * Math.cos(angleInRadians)),
            centerXY + (radius * Math.sin(angleInRadians))
        ].join(" ");
    };

    RoundSlider.prototype._drawArc = function (startAngle, endAngle, radius, isReverseDirection) {
        var actualEndAngle = endAngle;
        if (startAngle > endAngle) {
            endAngle += 360;
        }

        // For inverted range (and consider semi circle), the range should start from the Start angle
        // and will end in the slider end. And again start with the slider start and ends with the End angle
        var isInvertedRange = (this._oriAngle(endAngle) > this._end);
        if (isInvertedRange) {
            endAngle = this._start + this._end;
        }

        var isCircle = (endAngle - startAngle == 360);
        var largeArcFlag = Math.abs(startAngle - endAngle) <= 180 ? "0" : "1";
        var direction = isReverseDirection ? 0 : 1;
        var _endAngle = isReverseDirection ?  startAngle : endAngle;
        var endPoint = this._polarToCartesian(radius, _endAngle);

        var path = [];

        // if it is a perfect circle then draw two half circles, otherwise draw arc
        if (isCircle) {
            var midAngle = (startAngle + endAngle) / 2;
            var midPoint = this._polarToCartesian(radius, midAngle);
            path.push(
                "A", 1, 1, 0, 0, direction, midPoint,
                "A", 1, 1, 0, 0, direction, endPoint
            );
        }
        else {
            path.push(
                "A", radius, radius, 0, largeArcFlag, direction, endPoint
            );

            if (isInvertedRange) {
                var sliderStartAngle = this._start;
                var sliderStartPoint = this._polarToCartesian(radius, sliderStartAngle);

                path.push(
                    "M " + sliderStartPoint,
                    this._drawArc(sliderStartAngle, actualEndAngle, radius)
                );
            }
        }

        return path.join(" ");
    };

    RoundSlider.prototype._drawPath = function (startAngle, endAngle, outerRadius, innerRadius, lineCap){
        if (outerRadius == undefined) outerRadius = this.centerRadius;
        if (lineCap == undefined) lineCap = this.options.lineCap;

        var outerStart = this._polarToCartesian(outerRadius, startAngle);
        var outerArc = this._drawArc(startAngle, endAngle, outerRadius);          // draw outer circle

        var d = [
            "M " + outerStart,
            outerArc
        ];

        if (innerRadius && innerRadius !== outerRadius) {
            var innerEnd = this._polarToCartesian(innerRadius, endAngle);
            var innerArc = this._drawArc(startAngle, endAngle, innerRadius, true);     // draw inner circle

            if (lineCap == "none") {
                d.push(
                    "M " + innerEnd,
                    innerArc
                );
            }
            else if (lineCap == "round") {
                d.push(
                    "A 1, 1, 0, 0, 1, " + innerEnd,
                    innerArc,
                    "A 1, 1, 0, 0, 1, " + outerStart
                );
            }
            else if (lineCap == "butt" || lineCap == "square") {
                d.push(
                    "L " + innerEnd,
                    innerArc,
                    "L " + outerStart,
                    "Z"
                );
            }
        }
        return d.join(" ");
    };

    $.fn[pluginName].prototype = RoundSlider.prototype;

});