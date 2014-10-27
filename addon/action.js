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

export default DOMAction;
