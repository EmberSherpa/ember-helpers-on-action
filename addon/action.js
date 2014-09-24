import Ember from 'ember';

/**
 * Returns a new DOMAction
 */
export default function(handler, options) {
  return new DOMAction(handler, options);
}

function DOMAction(handler, options) {
  if (!(this instanceof DOMAction)) return new DOMAction(handler, options);
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

DOMAction.prototype.constructor = DOMAction;

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
    if (this.afterRender) {
      args.unshift(this.eventName);
      //Ember.run.scheduleOnce('afterRender', view, view.trigger, args);
      Ember.run.scheduleOnce('afterRender', view, function() {
        this.trigger.apply(this, args);
      });
    } else {
      view.trigger(this.eventName, args);
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
