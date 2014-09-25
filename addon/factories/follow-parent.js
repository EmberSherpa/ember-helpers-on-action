import Ember from 'ember';

/**
 * Returns a new Ember.View mixin that will cause the recipient of the mixin to bind to it's parent's event called {eventName}.
 * When the bound parent triggers {eventName}, the recipient will trigger {eventName} and pass along the arguments.
 * @param eventName
 * @returns {*}
 */
export default function followParent(eventName) {
  var options = {};
  var methodName = 'bind' + eventName.camelize();
  options[methodName] = function() {
    var parentView = this.get('parentView');
    if (parentView) {
      parentView.on(eventName, this, function(){
        var args = [].slice.apply(arguments);
        args.unshift(eventName);
        this.trigger.apply(this, args);
      });
    }
  }.on('didInsertElement');
  return Ember.Mixin.create(options);
}
