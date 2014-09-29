import Ember from 'ember';
import DOMAction from '../action';

export default Ember.Mixin.create({
  registry: null,
  createRegistry: function() {
    this.set('registry', {});
  }.on('init'),
  bindHandlers: function() {
    this.get('childViews')
      .filter(function(view){
        return !Ember.isNone(view.get('handles'));
      })
      .forEach(function(view){
        // register view with the dispatcher
        var events = view.get('handles');
        events.forEach(function register(eventName){
          this.registerHandler(eventName, view);
        }, this);
      }, this);
  }.on('willInsertElement'),
  /**
   * Binds action's notify event to function that will dispatch event
   * when action#notify is triggered.
   * @param eventName
   * @param action
   */
  registerAction: function(eventName, action) {
    Ember.assert('Action must be a DOMAction', action instanceof DOMAction);
    action.on('notify', this, function dispatchEvent(args){
      this.dispatch(eventName, args);
    });
    Ember.Logger.info(this.toString(), 'registered', action.toString(), 'to', eventName);
  },
  /**
   * Add view to registry for specific eventName
   * @param eventName
   * @param view
   */
  registerHandler: function(eventName, view) {
    var registry = this.get('registry');
    if (!registry.hasOwnProperty(eventName)) {
      registry[eventName] = Ember.A();
    }
    registry[eventName].push(view);
    Ember.Logger.info(this.toString(), 'registered', view.toString(), 'to', eventName);
  },
  /**
   * Trigger event on each handler who's registered for this event
   * @param eventName
   * @param args
   */
  dispatch: function(eventName, args) {
    args.unshift(eventName);
    var registry = this.get('registry');
    if (registry.hasOwnProperty(eventName)) {
      var handlers = registry[eventName];
      handlers.forEach(function(handler){
        handler.trigger.apply(handler, args);
      }, this);
    }
  }
});
