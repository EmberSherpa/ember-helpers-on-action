"use strict";
var Ember = require("ember")["default"] || require("ember");
var DOMAction = require("../action").DOMAction;

/**
 * Ember.View mixin that will cause the view to bind itself to parent's controller's DOM Actions.
 * When used on Component, the mixin will go to parentView's controller.
 */
exports["default"] = Ember.Mixin.create({
  _bindDOMActions: function() {
    var view;
    if (this instanceof Ember.Component) {
      view = this.get('parentView');
    } else if (this instanceof Ember.View){
      view = this;
    }
    Ember.assert("DOMActionMixin can only be used with a View or a Component", view != null);
    // get controller's actions hash
    var actions = view.get('controller._actions') || {};
    Ember.keys(actions).forEach(function(actionName){
      var action = actions[actionName];
      if (action instanceof DOMAction) {
        action.setup(this);
      }
    }, view);
  }.on('didInsertElement')
});