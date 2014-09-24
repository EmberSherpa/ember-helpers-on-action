import Ember from 'ember';
import {DOMAction} from './action';

/**
 * Ember.View mixin that will cause the view to bind itself to parent's controller's DOM Actions.
 * When used on Component, the mixin will go to parentView's controller.
 */
export default Ember.Mixin.create({
  bindDOMActions: function() {
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

/**
 * Returns a new Ember.View mixin that will cause the recipient of the mixin to bind to it's parent's event called {eventName}.
 * When the bound parent triggers {eventName}, the recipient will trigger {eventName} and pass along the arguments.
 * @param eventName
 * @returns {*}
 */
export function followParent(eventName) {
  return Ember.Mixin.create({
    bindToParent: function() {
      var parentView = this.get('parentView');
      if (parentView) {
        parentView.on(eventName, this, function(){
          var args = [].slice.apply(arguments);
          args.unshift(eventName);
          this.trigger.apply(this, args);
        });
      }
    }.on('didInsertElement')
  });
}

