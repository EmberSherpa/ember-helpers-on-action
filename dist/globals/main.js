!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.eda=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var DOMAction = Ember.Object.extend(Ember.Evented, {
  /**
   * Name of the action that is being triggered
   */
  actionName: null,
  /**
   * Original function defined on the controller
   */
  actionFunction: null,
  /**
   * Name of the event to trigger
   */
  eventName: null,
  /**
   * Object where the action is defined
   */
  source: null,
  apply: function(target, args) {
    this.trigger('action', args);
    return this.perform(target, args);
  },
  /**
   * Call the function that this object wraps
   * @param target
   * @param args
   * @returns {*}
   */
  perform: function(target, args) {
    return this.get('actionFunction').apply(target, args);
  },
  /**
   * Bind an event to this object. This allows us to trigger an event by same name on all registered views.
   * @param view
   */
  register: function(view) {
    Ember.assert("View must be an Ember.view", view instanceof Ember.View);
    var eventName = this.get('eventName');
    var action = this;
    function triggerViewAction(args){
      view.trigger.apply(view, [eventName].concat(args));
    }
    this.on('action', triggerViewAction);
    view.on('willDestroyElement', function(){
      action.off('action', triggerViewAction);
    });
    Ember.Logger.info('Registered %@ onto %@'.fmt(eventName, view.toString()));
  }
});

DOMAction.reopenClass({
  convert: function(target, actionName, eventName) {
    Ember.assert("Target must implement Ember.ActionHandlerMixin - ie. be controller.", Ember.ActionHandler.detect(target));
    var func =  target._actions[actionName];
    var action = DOMAction.create({
      actionFunction: func,
      actionName: actionName,
      eventName: eventName,
      source: target
    });
    target._actions[actionName] = action;
    return action;
  }
});

exports["default"] = DOMAction;
},{}],2:[function(_dereq_,module,exports){
"use strict";
var DOMAction = _dereq_("./action")["default"] || _dereq_("./action");
exports["default"] = DOMAction;
},{"./action":1}]},{},[2])
(2)
});