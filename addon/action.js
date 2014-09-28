import Ember from 'ember';

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
  apply: function(controller) {
    var args = [].slice(arguments, 1);
    var eventName = this.get('eventName');
    // trigger events that are bound to
    this.trigger.call(this, eventName, args);
    var func = this.get('actionFunction');
    return func.apply(controller, args);
  },
  register: function(eventName, view) {
    Ember.assert("View must be an Ember.view", view instanceof Ember.View);
    this.on(eventName, function triggerViewAction(args){
      // add eventName to the beginning of the args array
      args.unshift(eventName);
      // push domAction to the end of the args array
      args.push(this);
      view.trigger.apply(view, args);
    });
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

export default DOMAction;
