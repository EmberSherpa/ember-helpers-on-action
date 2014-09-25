!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.eda=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

/**
 * Returns a new DOMAction
 */
exports["default"] = function(handler, options) {
  return new DOMAction(handler, options);
}

function DOMAction(handler, options) {
  if (!(this instanceof DOMAction)) {
    return new DOMAction(handler, options);
  }
  if (Ember.typeOf(handler) === 'string') {
    this.eventName = handler;
  }
  if (Ember.typeOf(handler) === 'function') {
    this.func = handler;
  }
  options = Ember.merge({
    afterRender: false,
    bubble: false
  }, options);

  this.afterRender = options.afterRender;
  this.bubble = options.bubble;
}

exports.DOMAction = DOMAction;DOMAction.prototype.constructor = DOMAction;

/**
 * Name of the event to trigger on the
 * @type {null}
 */
DOMAction.prototype.eventName = null;
/**
 * View that this action targets
 * @type {null}
 */
DOMAction.prototype.view = null;
/**
 * Function that will be called when action is triggered
 * @type {null}
 */
DOMAction.prototype.func = null;

DOMAction.prototype.setup = function(view) {
  this.view = view;
};

DOMAction.prototype.apply = function(controller, args) {
  var view = this.view;

  if (view && this.eventName != null && view.trigger != null) {
    args.unshift(this.eventName);
    if (this.afterRender) {
      //Ember.run.scheduleOnce('afterRender', view, view.trigger, args);
      Ember.run.scheduleOnce('afterRender', view, function() {
        view.trigger.apply(view, args);
      });
    } else {
      view.trigger.apply(view, args);
    }
    if (this.bubble) {
      return true;
    }
  }

  if (this.func != null) {
    var controllerProxy = Ember.ObjectProxy.create({
      content: controller,
      view: view
    });
    return this.func.apply(controllerProxy, args);
  }
};
},{}],2:[function(_dereq_,module,exports){
"use strict";
var DOMAction = _dereq_("./action")["default"] || _dereq_("./action");
exports["default"] = DOMAction;
},{"./action":1}]},{},[2])
(2)
});