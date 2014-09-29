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
  apply: function(target, args) {
    this.trigger('notify', args);
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
   * Trigger the event for this action
   * @param args
   */
  onNotify: function(args) {
    this.trigger(this.get('eventName'), args);
  }.on('notify'),
  /**
   * Bind an event to this object. This allows us to trigger an event by same name on all registered views.
   * @param view
   */
  register: function(view) {
    Ember.assert("View must be an Ember.view", view instanceof Ember.View);
    var eventName = this.get('eventName');
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
