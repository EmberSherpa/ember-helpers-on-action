"use strict";
var Ember = require("ember")["default"] || require("ember");
var DOMAction = require("./action")["default"] || require("./action");

var get = Ember.get;

/**
 * Bind an event emitter to an action on context via a Handlebars Helper
 *
 * {{on-action 'paginate' trigger="jump-to-top"}}
 *
 * @param {string} actionName
 * @param {object} options
 */
exports["default"] = function onActionHelper(actionName, options){
  Ember.assert("{{on-action}} actionName parameter is missing.", actionName != null);

  var context = get(options, 'hash.context') || this;
  var view = get(options, 'data.view.parentView');
  var eventName = get(options, 'hash.trigger') || actionName;
  if (get(context, '_actions') == null) {
    context._actions = {};
  }
  var actions = get(context, '_actions');
  var action;

  if (actions.hasOwnProperty(actionName)) {
    action = actions[actionName];
  } else {
    var bubble = options.hash.bubble || false;
    action = function defaultAction() {
      return bubble;
    };
    actions[actionName] = action;
  }
  action = action instanceof DOMAction ? action : DOMAction.convert(context, actionName, eventName);

  /**
   * Register view with the action.
   * When action is triggered, the event will be triggered on this view.
   */
  action.register(view);
}